// Imports data from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Imports html elements
import { htmlElements } from "./utils/htmlElements.js";

// Imports class constructor then calls it
import { BookHandler } from "./utils/bookHandler.js";
new BookHandler();

// Imports function then calls it
import { themeHandler } from "./utils/themeHandler.js";

import { loadEventListeners } from "./utils/eventListenerHandler.js";

let page = 1;
let matches = books;

// Loads abstracted head meta data && Displays
document.addEventListener("DOMContentLoaded", () => {
  fetchHTMLMETA();
  loadEventListeners();
  themeHandler();
});

function fetchHTMLMETA() {
  fetch("./meta.html")
    .then((response) => response.text())
    .then((data) => {
      htmlElements.head.innerHTML = data;
    });
}

// Creates option element
function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.innerText = text;
  return option;
}

// Function populates select element with genres && Authors
function populateSelect(element, options, firstOptionText) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createOption("any", firstOptionText));
  for (const [value, text] of Object.entries(options)) {
    fragment.appendChild(createOption(value, text));
  }
  element.appendChild(fragment);
}

// Populate genres select
populateSelect(htmlElements.dataSearchGenres, genres, "All Genres");

// Populate authors select
populateSelect(htmlElements.dataSearchAuthers, authors, "All Authors");

// Update the "Show more" button
const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
htmlElements.dataListButton.innerHTML = `
  <span>Show more</span>
  <span class="list__remaining"> (${
    remainingBooks > 0 ? remainingBooks : 0
  })</span>
`;
htmlElements.dataListButton.disabled = remainingBooks <= 0;
htmlElements.dataListButton.innerText = `Show more (${
  books.length - BOOKS_PER_PAGE
})`;

// Create book preview elements
function createBookPreviewElement({ author, id, image, title }) {
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

// Updates book list
function updateBookList(result) {
  const newItems = document.createDocumentFragment();

  for (const book of result.slice(0, BOOKS_PER_PAGE)) {
    const element = createBookPreviewElement(book);
    newItems.appendChild(element);
  }

  htmlElements.dataListItems.innerHTML = "";
  htmlElements.dataListItems.appendChild(newItems);

  htmlElements.dataListButton.disabled = result.length <= BOOKS_PER_PAGE;
  htmlElements.dataListButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(
      result.length - BOOKS_PER_PAGE,
      0
    )})</span>
  `;

  htmlElements.dataListMessage.classList.toggle(
    "list__message_show",
    result.length === 0
  );
}
