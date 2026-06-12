const form = document.querySelector("#registerForm");

if (form) {
  const statusBox = document.querySelector("#registerStatus");
  const successPanel = document.querySelector("#registerSuccess");
  const icsLink = document.querySelector("#registerIcs");
  const honeypot = document.querySelector("#empresaWeb");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const URL_RE = /^https?:\/\/.+/i;

  // Mientras Resend no este disponible (dominio pendiente de verificar),
  // el registro se envia por mailto al equipo, con copia al asistente.
  const NOTIFY_EMAIL = "fer@noisia.ai";

  const EVENT = {
    uid: "listenup-5-0@listenup.lat",
    name: "ListenUp! 5.0",
    topic: "Buen Fin & Black Friday: como piensa el consumidor mexicano.",
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

  function buildMailtoUrl(payload) {
    const subject = `Nuevo registro ${EVENT.name}`;
    const body = [
      `Nuevo registro para ${EVENT.name} (${EVENT.dateLabel}, ${EVENT.city}).`,
      "",
      `Nombre: ${payload.name}`,
      `Email: ${payload.email}`,
      `Empresa: ${payload.company}`,
      `Puesto/rol: ${payload.role}`,
      `Ciudad: ${payload.city}`,
      `LinkedIn: ${payload.linkedin || "-"}`,
      `Consentimiento para recibir comunicaciones: ${payload.consent ? "Si" : "No"}`,
      `Pagina origen: ${payload.sourcePage}`,
      `Fecha de registro: ${payload.timestamp}`,
    ].join("\n");

    const params = new URLSearchParams({ subject, body });
    if (payload.email) params.set("cc", payload.email);

    // mailto (RFC 6068) espera %20 para espacios; URLSearchParams usa "+".
    return `mailto:${NOTIFY_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("");

    let firstInvalid = null;
    Object.entries(fieldValidators).forEach(([name, validate]) => {
      const input = form.elements.namedItem(name);
      const message = validate(input.value);
      setFieldError(name, message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    const consentInput = form.elements.namedItem("consent");
    const consentError = document.querySelector("#consentError");
    if (!consentInput.checked) {
      consentError.textContent = "Necesitamos tu consentimiento para registrarte.";
      consentError.classList.add("is-visible");
      if (!firstInvalid) firstInvalid = consentInput;
    } else {
      consentError.textContent = "";
      consentError.classList.remove("is-visible");
    }

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
      consent: consentInput.checked,
      sourcePage: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Honeypot anti-spam: si el campo oculto viene lleno, no abrimos el cliente de correo.
    if (honeypot && honeypot.value) {
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.focus();
      return;
    }

    if (icsLink) {
      const blob = new Blob([buildEventIcs()], { type: "text/calendar" });
      icsLink.href = URL.createObjectURL(blob);
    }

    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();

    window.location.href = buildMailtoUrl(payload);
  });
}
