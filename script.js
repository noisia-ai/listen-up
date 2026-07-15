const header = document.querySelector("#siteHeader");
const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");
const signupForm = document.querySelector("#signupForm");
const emailInput = document.querySelector("#email");
const formNote = document.querySelector("#formNote");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("is-open", !isOpen);
  header.classList.toggle("is-open", !isOpen);
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    header.classList.remove("is-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    formNote.classList.remove("is-error", "is-success");

    if (!isValid) {
      formNote.textContent = "Revisa el correo: parece que falta algo.";
      formNote.classList.add("is-error");
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }

    emailInput.setAttribute("aria-invalid", "false");
    formNote.textContent = "Listo. Te escribiremos con lo proximo de ListenUp!.";
    formNote.classList.add("is-success");
    signupForm.reset();
  });
}

const lightbox = document.querySelector("#lightbox");

if (lightbox) {
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxBackdrop = document.querySelector("#lightboxBackdrop");
  const lightboxClose = document.querySelector("#lightboxClose");
  const lightboxPrev = document.querySelector("#lightboxPrev");
  const lightboxNext = document.querySelector("#lightboxNext");
  const galleryImages = Array.from(document.querySelectorAll(".gallery-strip__item img"));
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
  }

  document.querySelectorAll(".gallery-strip__item").forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxBackdrop.addEventListener("click", closeLightbox);
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showImage(currentIndex - 1));
  lightboxNext.addEventListener("click", () => showImage(currentIndex + 1));

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });
}
