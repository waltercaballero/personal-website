import "./style.css";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

// Evitar flicker de tema antes de renderizar
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Inicialización de herramientas de Vercel
inject();
injectSpeedInsights();

// Formulario de contacto
const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById("honeypot").value;
    if (honeypot) return;

    const btn = contactForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const formData = {
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
      honeypot: document.getElementById("honeypot").value,
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        contactForm.classList.add("hidden"); // Oculta el formulario
        successMessage.classList.remove("hidden"); // Muestra el mensaje
      } else {
        throw new Error("Error en el envío");
      }
    } catch (error) {
      alert(
        "Hubo un problema. Por favor, intenta de nuevo o escríbeme directamente por email.",
      );
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });
}

// Theme
const themeToggleBtn = document.getElementById("theme-toggle");
const darkIcon = document.getElementById("theme-toggle-dark-icon");
const lightIcon = document.getElementById("theme-toggle-light-icon");

// Función para actualizar iconos
const updateIcons = () => {
  if (document.documentElement.classList.contains("dark")) {
    lightIcon.classList.remove("hidden");
    darkIcon.classList.add("hidden");
  } else {
    lightIcon.classList.add("hidden");
    darkIcon.classList.remove("hidden");
  }
};

updateIcons();

themeToggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("color-theme", "dark");
  } else {
    localStorage.setItem("color-theme", "light");
  }
  updateIcons();
});
