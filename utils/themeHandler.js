// Imports object from htmlElements.js
import { htmlElements } from "./htmlElements.js";

export class ThemeHandler {
  constructor() {
    this.init;
  }

  init() {
    // Check user preference for color theme
    const prefersDarkScheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = prefersDarkScheme ? "night" : "day";
    this.toggleTheme(theme);

    // Handle color theme change
    htmlElements.dataSettingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      this.toggleTheme(theme);

      htmlElements.dataSettingsOverlay.open = false;
    });
  }

  toggleTheme(theme) {
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
