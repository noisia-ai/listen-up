(function () {
  "use strict";

  var API = "/api/event-checkin";
  var TOKEN_KEY = "checkin_token";

  var authScreen = document.getElementById("authScreen");
  var appScreen = document.getElementById("appScreen");
  var tokenInput = document.getElementById("tokenInput");
  var authBtn = document.getElementById("authBtn");
  var authError = document.getElementById("authError");
  var searchInput = document.getElementById("searchInput");
  var resultsList = document.getElementById("resultsList");
  var statusMsg = document.getElementById("statusMsg");
  var counterEl = document.getElementById("counterEl");

  var allAttendees = []; // full list from last fetch
  var debounceTimer = null;

  // ── AUTH ────────────────────────────────────────────────────────────────────

  function getToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
  }

  function setToken(token) {
    try { sessionStorage.setItem(TOKEN_KEY, token); } catch (e) {}
  }

  function clearToken() {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }

  async function tryAuth(token) {
    var res = await fetch(API + "?q=", {
      headers: { "x-checkin-token": token },
    });
    return res.status !== 401;
  }

  authBtn.addEventListener("click", async function () {
    var token = tokenInput.value.trim();
    if (!token) return;
    authBtn.disabled = true;
    authError.textContent = "";
    var ok = await tryAuth(token);
    authBtn.disabled = false;
    if (!ok) {
      authError.textContent = "Código incorrecto. Inténtalo de nuevo.";
      tokenInput.select();
      return;
    }
    setToken(token);
    showApp();
  });

  tokenInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") authBtn.click();
  });

  // ── APP ─────────────────────────────────────────────────────────────────────

  function showApp() {
    authScreen.style.display = "none";
    appScreen.style.display = "block";
    loadAll();
    searchInput.focus();
  }

  async function loadAll() {
    statusMsg.textContent = "Cargando asistentes…";
    statusMsg.hidden = false;
    resultsList.hidden = true;

    var token = getToken();
    var res;
    try {
      res = await fetch(API + "?q=", { headers: { "x-checkin-token": token } });
    } catch (err) {
      statusMsg.textContent = "Error de conexión. Verifica tu red.";
      return;
    }

    if (res.status === 401) {
      clearToken();
      authScreen.style.display = "flex";
      appScreen.style.display = "none";
      authError.textContent = "Sesión expirada. Vuelve a ingresar el código.";
      return;
    }

    var data = await res.json();
    allAttendees = data.results || [];
    renderList(allAttendees);
  }

  function renderList(attendees) {
    resultsList.innerHTML = "";

    var total = allAttendees.length;
    var checked = allAttendees.filter(function (a) { return a.checkedIn; }).length;
    counterEl.textContent = checked + " / " + total;

    if (!attendees.length) {
      statusMsg.textContent = "Sin resultados.";
      statusMsg.hidden = false;
      resultsList.hidden = true;
      return;
    }

    statusMsg.hidden = true;
    resultsList.hidden = false;

    attendees.forEach(function (attendee) {
      var li = document.createElement("li");
      li.className = "attendee-item";
      li.dataset.row = attendee.rowIndex;

      var info = document.createElement("div");
      info.className = "attendee-info";

      var name = document.createElement("div");
      name.className = "attendee-name";
      name.textContent = attendee.name;

      var meta = document.createElement("div");
      meta.className = "attendee-meta";
      meta.textContent = [attendee.company, attendee.email].filter(Boolean).join(" · ");

      info.appendChild(name);
      info.appendChild(meta);

      var btn = document.createElement("button");
      btn.className = attendee.checkedIn
        ? "checkin-btn checkin-btn--done"
        : "checkin-btn checkin-btn--pending";
      btn.textContent = attendee.checkedIn ? "✓ Check-in" : "Check-in";
      if (attendee.checkedIn) btn.disabled = true;

      btn.addEventListener("click", function () {
        handleCheckin(attendee, btn);
      });

      li.appendChild(info);
      li.appendChild(btn);
      resultsList.appendChild(li);
    });
  }

  async function handleCheckin(attendee, btn) {
    if (attendee.checkedIn) return;
    btn.disabled = true;
    btn.textContent = "…";

    var token = getToken();
    var res;
    try {
      res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-checkin-token": token,
        },
        body: JSON.stringify({ rowIndex: attendee.rowIndex }),
      });
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Check-in";
      alert("Error de conexión. Inténtalo de nuevo.");
      return;
    }

    if (res.status === 401) {
      clearToken();
      location.reload();
      return;
    }

    if (!res.ok) {
      btn.disabled = false;
      btn.textContent = "Check-in";
      alert("Error al registrar check-in. Inténtalo de nuevo.");
      return;
    }

    // Update local state
    attendee.checkedIn = true;
    btn.className = "checkin-btn checkin-btn--done";
    btn.textContent = "✓ Check-in";
    btn.disabled = true;

    // Refresh counter
    var total = allAttendees.length;
    var checked = allAttendees.filter(function (a) { return a.checkedIn; }).length;
    counterEl.textContent = checked + " / " + total;
  }

  // ── SEARCH ──────────────────────────────────────────────────────────────────

  function normalize(str) {
    return String(str)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var q = normalize(searchInput.value);
      if (!q) {
        renderList(allAttendees);
        return;
      }
      var filtered = allAttendees.filter(function (a) {
        return normalize(a.name).includes(q);
      });
      renderList(filtered);
    }, 200);
  });

  // ── INIT ────────────────────────────────────────────────────────────────────

  var saved = getToken();
  if (saved) {
    authScreen.style.display = "none";
    appScreen.style.display = "block";
    loadAll();
    searchInput.focus();
  }
})();
