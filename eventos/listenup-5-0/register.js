const form = document.querySelector("#registerForm");

if (form) {
  const statusBox = document.querySelector("#registerStatus");
  const successPanel = document.querySelector("#registerSuccess");
  const icsLink = document.querySelector("#registerIcs");
  const honeypot = document.querySelector("#empresaWeb");
  const submitButton = document.querySelector("#registerSubmit");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const URL_RE = /^https?:\/\/.+/i;

  const EVENT = {
    uid: "listenup-5-0@listenup.lat",
    name: "ListenUp! 5.0",
    topic: "Del insight a la acción: Cómo la IA está redefiniendo el Social Listening",
    city: "CDMX",
    dateLabel: "13 de agosto de 2026",
    startUTC: "20260813T160000Z",
    endUTC: "20260813T210000Z",
  };

  const fieldValidators = {
    name: (value) => (value.trim().length > 0 ? "" : "Cuentanos tu nombre completo."),
    email: (value) => (EMAIL_RE.test(value.trim()) ? "" : "Revisa tu correo, parece que falta algo."),
    company: (value) => (value.trim().length > 0 ? "" : "Indica tu empresa."),
    role: (value) => (value.trim().length > 0 ? "" : "Indica tu puesto o rol."),
    city: (value) => (value.trim().length > 0 ? "" : "Indica tu ciudad."),
    linkedin: (value) => (!value.trim() || URL_RE.test(value.trim()) ? "" : "Usa un enlace valido (https://...)."),
  };

  const SERVER_FIELD_MESSAGES = {
    name: "Cuentanos tu nombre completo.",
    email: "Revisa tu correo, parece que falta algo.",
    company: "Indica tu empresa.",
    role: "Indica tu puesto o rol.",
    city: "Indica tu ciudad.",
    linkedin: "Usa un enlace valido (https://...).",
  };

  function setFieldError(name, message) {
    const input = form.elements.namedItem(name);
    const errorEl = document.querySelector(`#${name}Error`);
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
    statusBox.textContent = message;
    statusBox.classList.toggle("is-error", Boolean(isError));
  }

  function buildEventIcs() {
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ListenUp!//Evento 5.0//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${EVENT.uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${EVENT.startUTC}`,
      `DTEND:${EVENT.endUTC}`,
      `SUMMARY:${EVENT.name}`,
      `DESCRIPTION:${EVENT.topic.replace(/,/g, "\\,")}`,
      `LOCATION:${EVENT.city.replace(/,/g, "\\,")}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    let firstInvalid = null;
    Object.entries(fieldValidators).forEach(([name, validate]) => {
      const input = form.elements.namedItem(name);
      const message = validate(input.value);
      setFieldError(name, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const payload = {
      name: form.elements.namedItem("name").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      company: form.elements.namedItem("company").value.trim(),
      role: form.elements.namedItem("role").value.trim(),
      city: form.elements.namedItem("city").value.trim(),
      linkedin: form.elements.namedItem("linkedin").value.trim(),
      consent: form.elements.namedItem("consent")?.checked ?? false,
      sourcePage: window.location.href,
      empresaWeb: honeypot ? honeypot.value : "",
    };

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    try {
      const response = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.error === "validation_error" && result.fields) {
          Object.entries(result.fields).forEach(([name, code]) => {
            const message = SERVER_FIELD_MESSAGES[name] || "Revisa este campo.";
            setFieldError(name, message);
          });
          setStatus("Revisa los campos marcados e intenta de nuevo.", true);
        } else {
          setStatus("No pudimos procesar tu registro. Intenta de nuevo en unos minutos.", true);
        }
        return;
      }

      if (icsLink) {
        const blob = new Blob([buildEventIcs()], { type: "text/calendar" });
        icsLink.href = URL.createObjectURL(blob);
      }

      form.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
    } catch (error) {
      setStatus("No pudimos conectar con el servidor. Revisa tu conexion e intenta de nuevo.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Confirmar mi registro";
    }
  });
}
