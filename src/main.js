import "./style.css";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

inject();
injectSpeedInsights();

const contactForm = document.getElementById("contact-form");
const successMessage = document.getElementById("success-message");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Cambiar el estado del botón
    const btn = contactForm.querySelector("button");
    const originalText = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const formData = {
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
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
