// imports the data
import { books, authors, BOOKS_PER_PAGE } from "../data.js";

class BookPreview extends HTMLElement {
  constructor() {
    super();
    // Finds the template in DOM
    const template = document.getElementById("book-preview-template").content;
    this.attachShadow({ mode: "open" }).appendChild(template.cloneNode(true));

    // Creates a shadow style sheet
    const style = document.createElement("style");
    this.shadowRoot.appendChild(style);

    // Fetches the styling
    fetch("styles.css")
      .then((response) => response.text())
      .then((css) => {
        style.textContent = css;
      });
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".preview")
      .setAttribute("data-preview", this.getAttribute("data-preview"));
    this.shadowRoot.querySelector(".preview__image").src =
      this.getAttribute("data-image");
    this.shadowRoot.querySelector(".preview__title").textContent =
      this.getAttribute("data-title");
    this.shadowRoot.querySelector(".preview__author").textContent =
      this.getAttribute("data-author");
  }
}

// I know this calls the web Component
customElements.define("book-preview", BookPreview);

// Basic coppied logic from base code
const starting = document.createDocumentFragment();
let matches = books;

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement("book-preview");
  element.setAttribute("data-preview", id);
  element.setAttribute("data-image", image);
  element.setAttribute("data-title", title);
  element.setAttribute("data-author", authors[author]);
  starting.appendChild(element);
}

document.querySelector("[data-list-items]").appendChild(starting);

// I'm not even going to pretend I full understand how this works
