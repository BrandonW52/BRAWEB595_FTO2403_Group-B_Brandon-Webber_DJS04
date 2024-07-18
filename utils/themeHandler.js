// Imports object from htmlElements.js
import { htmlElements } from "./htmlElements.js";

// Exports and declares
export function themeHandler() {
  // Checks user prefrance for color theme
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    let theme = "night";
    toggleTheme(theme);
  } else {
    let theme = "day";
    toggleTheme(theme);
  }

  // Handles color theme change
  htmlElements.dataSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    toggleTheme(theme);

    htmlElements.dataSettingsOverlay.open = false;
  });

  // Switches between Light and Dark themes
  function toggleTheme(theme) {
    document.documentElement.style.setProperty(
      "--color-dark",
      theme === "night" ? "255, 255, 255" : "10, 10, 20"
    );
    document.documentElement.style.setProperty(
      "--color-light",
      theme === "night" ? "10, 10, 20" : "255, 255, 255"
    );
  }
}
