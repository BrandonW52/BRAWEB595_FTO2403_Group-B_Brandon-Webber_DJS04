// Imports object from htmlElements.js
import { htmlElements } from "./htmlElements.js";

export function loadEventListeners() {
  // Handles Click events
  htmlElements.dataSearchCancel.addEventListener("click", () => {
    htmlElements.dataSearchOverlay.open = false;
  });

  htmlElements.dataSettingsCancel.addEventListener("click", () => {
    htmlElements.dataSettingsOverlay.open = false;
  });

  htmlElements.dataHeaderSearch.addEventListener("click", () => {
    htmlElements.dataSearchOverlay.open = true;
    htmlElements.dataSearchTitle.focus();
  });

  htmlElements.dataHeaderSettings.addEventListener("click", () => {
    htmlElements.dataSettingsOverlay.open = true;
  });

  htmlElements.dataListClose.addEventListener("click", () => {
    htmlElements.dataListActive.open = false;
  });
}
