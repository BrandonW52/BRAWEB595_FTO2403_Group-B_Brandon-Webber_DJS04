// Imports data from data.js
import { books, authors, BOOKS_PER_PAGE } from "../data.js";

// Imports object from htmlElements.js
import { htmlElements } from "./htmlElements.js";

// Class constructor for creating book preview
export class BookHandler {
  constructor() {
    this.page = 1;
    this.matches = books;
    this.htmlElement = htmlElements;

    document.addEventListener(
      "DOMContentLoaded",
      this.addBookPreview.bind(this)
    );
  }

  // Creates book element for html
  createBookElement({ author, id, image, title }) {
    const element = document.createElement("button");
    element.classList.add("preview");
    element.dataset.preview = id;

    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    return element;
  }

  // Adds book preview to html
  addBookPreview() {
    const starting = document.createDocumentFragment();
    for (const book of this.matches.slice(0, BOOKS_PER_PAGE)) {
      const element = this.createBookElement(book);
      starting.appendChild(element);
    }
    this.htmlElement.dataListItems.appendChild(starting);
  }
}
