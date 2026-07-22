document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("communityModal");

  // En páginas sin modal, los botones redirigen al index con ?modal=tipo
  if (!modal) {
    document.querySelectorAll("[data-modal-type]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tipo = btn.getAttribute("data-modal-type") || "invitado";
        window.location.href = "/?modal=" + tipo;
      });
    });
    return;
  }

  var backdrop = document.getElementById("modalBackdrop");
  var closeBtn = document.getElementById("modalClose");
  var typeSelector = document.getElementById("modalTypeSelector");
  var form = document.getElementById("communityForm");
  var successPanel = document.getElementById("communitySuccess");
  var typeInput = document.getElementById("communityType");
  var selectedTypeLabel = document.getElementById("modalSelectedType");
  var interestField = document.getElementById("interestField");
  var backBtn = document.getElementById("modalBack");
  var submitBtn = document.getElementById("communitySubmit");
  var statusBox = document.getElementById("communityStatus");
  var successTag = document.getElementById("successTag");
  var successMessage = document.getElementById("successMessage");

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var URL_RE = /^https?:\/\/.+/i;

  var TYPE_LABELS = {
    invitado: "Invitado · Comunidad ListenUp!",
    patrocinador: "Patrocinador · ListenUp!",
  };

  var fieldValidators = {
    name: function (v) { return v.trim() ? "" : "Cuentanos tu nombre completo."; },
    email: function (v) { return EMAIL_RE.test(v.trim()) ? "" : "Revisa tu correo, parece que falta algo."; },
    company: function (v) { return v.trim() ? "" : "Indica tu empresa."; },
    role: function (v) { return v.trim() ? "" : "Indica tu puesto o rol."; },
    city: function (v) { return v.trim() ? "" : "Indica tu ciudad."; },
    linkedin: function (v) { return !v.trim() || URL_RE.test(v.trim()) ? "" : "Usa un enlace valido (https://...)."; },
  };

  function openModal(type) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (type) {
      showForm(type);
    } else {
      showTypeSelector();
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    resetModal();
  }

  function showTypeSelector() {
    typeSelector.hidden = false;
    form.hidden = true;
    successPanel.hidden = true;
  }

  function showForm(type) {
    typeSelector.hidden = true;
    form.hidden = false;
    successPanel.hidden = true;
    typeInput.value = type;
    if (selectedTypeLabel) selectedTypeLabel.textContent = TYPE_LABELS[type] || type;
    if (interestField) interestField.hidden = type !== "patrocinador";
    if (submitBtn) submitBtn.textContent = type === "patrocinador" ? "Solicitar patrocinio" : "Unirme a la comunidad";

    var consentLabel = document.getElementById("cm-consentLabel");
    if (consentLabel) {
      consentLabel.textContent = "Acepto recibir informacion de ListenUp! y sus patrocinadores.";
    }

    var firstField = form.querySelector("input:not([type=hidden])");
    if (firstField) firstField.focus();
  }

  function resetModal() {
    if (form) form.reset();
    showTypeSelector();
    if (statusBox) statusBox.textContent = "";
    form.querySelectorAll(".field__error").forEach(function (el) {
      el.textContent = "";
      el.classList.remove("is-visible");
    });
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
    });
  }

  function setFieldError(name, message) {
    var input = form.querySelector("[name='" + name + "']");
    var errorEl = document.getElementById("cm-" + name + "Error");
    if (!input || !errorEl) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
    }
  }

  function setStatus(message, isError) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.classList.toggle("is-error", Boolean(isError));
  }

  // Botones en seccion #unete
  document.querySelectorAll("[data-modal-type]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-modal-type"));
    });
  });

  // Selector de tipo dentro del modal
  document.querySelectorAll(".community-modal__type-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showForm(btn.getAttribute("data-type"));
    });
  });

  if (backBtn) backBtn.addEventListener("click", showTypeSelector);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setStatus("");

      var type = typeInput ? typeInput.value : "";
      var firstInvalid = null;
      Object.entries(fieldValidators).forEach(function (entry) {
        var name = entry[0];
        var validate = entry[1];
        var input = form.querySelector("[name='" + name + "']");
        var message = validate(input ? input.value : "");
        setFieldError(name, message);
        if (message && !firstInvalid) firstInvalid = input;
      });

      if (type === "patrocinador") {
        var interestInput2 = form.querySelector("[name='interest']");
        var interestError = document.getElementById("cm-interestError");
        if (interestInput2 && !interestInput2.value.trim()) {
          if (interestError) { interestError.textContent = "Indica la herramienta o marca que representas."; interestError.classList.add("is-visible"); }
          interestInput2.setAttribute("aria-invalid", "true");
          if (!firstInvalid) firstInvalid = interestInput2;
        } else if (interestInput2) {
          if (interestError) { interestError.textContent = ""; interestError.classList.remove("is-visible"); }
          interestInput2.setAttribute("aria-invalid", "false");
        }
      }

      var consentInput = form.querySelector("[name='consent']");

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var honeypot = form.querySelector("[name='empresaWeb']");
      var interestInput = form.querySelector("[name='interest']");

      var payload = {
        type: type,
        name: (form.querySelector("[name='name']") || {}).value || "",
        email: (form.querySelector("[name='email']") || {}).value || "",
        company: (form.querySelector("[name='company']") || {}).value || "",
        role: (form.querySelector("[name='role']") || {}).value || "",
        city: (form.querySelector("[name='city']") || {}).value || "",
        linkedin: ((form.querySelector("[name='linkedin']") || {}).value || "").trim(),
        interest: interestInput ? interestInput.value.trim() : "",
        consent: consentInput ? consentInput.checked : false,
        sourcePage: window.location.href,
        empresaWeb: honeypot ? honeypot.value : "",
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando..."; }

      try {
        var response = await fetch("/api/community-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        var result = {};
        try { result = await response.json(); } catch (_) {}

        if (!response.ok) {
          if (result.error === "validation_error" && result.fields) {
            Object.entries(result.fields).forEach(function (entry) {
              var name = entry[0];
              var fieldMsg = { name: "Cuentanos tu nombre completo.", email: "Revisa tu correo.", company: "Indica tu empresa.", role: "Indica tu puesto o rol.", city: "Indica tu ciudad.", linkedin: "Usa un enlace valido (https://...)." };
              setFieldError(name, fieldMsg[name] || "Revisa este campo.");
            });
            setStatus("Revisa los campos marcados e intenta de nuevo.", true);
          } else {
            setStatus("No pudimos procesar tu solicitud. Intenta de nuevo en unos minutos.", true);
          }
          return;
        }

        window.location.href = "/gracias/?tipo=" + (type === "patrocinador" ? "patrocinador" : "comunidad");
      } catch (_) {
        setStatus("No pudimos conectar con el servidor. Revisa tu conexion e intenta de nuevo.", true);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = type === "patrocinador" ? "Solicitar patrocinio" : "Unirme a la comunidad";
        }
      }
    });
  }

  // Auto-abrir modal si la URL tiene ?modal=invitado o ?modal=patrocinador
  var modalParam = new URLSearchParams(window.location.search).get("modal");
  if (modalParam === "invitado" || modalParam === "patrocinador") {
    openModal(modalParam);
    // Limpiar el param de la URL sin recargar
    var cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
  }
});
