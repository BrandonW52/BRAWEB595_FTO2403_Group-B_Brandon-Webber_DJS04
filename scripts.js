// Imports data from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Imports html elements
import { htmlElements } from "./utils/htmlElements.js";

// Imports theme function
import { themeHandler } from "./utils/themeHandler.js";

// Imports basic event listners
import { loadEventListeners } from "./utils/eventListenerHandler.js";

let page = 1;
let matches = books;

// calls imported and start up functions
document.addEventListener("DOMContentLoaded", () => {
  fetchHTMLMETA();
  loadEventListeners();
  themeHandler();

  updateBookList(matches);
});

// Fetches meta.html
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

// Handles event listener for search form
htmlElements.dataSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = books.filter((book) => {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);

    return titleMatch && authorMatch && genreMatch;
  });

  page = 1;
  matches = result;
  updateBookList(result);

  window.scrollTo({ top: 0, behavior: "smooth" });
  htmlElements.dataSearchOverlay.open = false;
});

// Handles event listener to show more
htmlElements.dataListButton.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const book of matches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = createBookPreviewElement(book);
    fragment.appendChild(element);
  }

  htmlElements.dataListItems.appendChild(fragment);
  page += 1;

  htmlElements.dataListButton.disabled =
    matches.length <= page * BOOKS_PER_PAGE;
  htmlElements.dataListButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(
      matches.length - page * BOOKS_PER_PAGE,
      0
    )})</span>
  `;
});

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

// Handles event listener to show details of clicked book
htmlElements.dataListItems.addEventListener("click", (event) => {
  const previewId = event.target.closest(".preview")?.dataset.preview;
  if (!previewId) return;

  const activeBook = books.find((book) => book.id === previewId);
  if (activeBook) {
    htmlElements.dataListActive.open = true;
    htmlElements.dataListBlur.src = activeBook.image;
    htmlElements.dataListImage.src = activeBook.image;
    htmlElements.dataListTitle.innerText = activeBook.title;
    htmlElements.dataListSubtitle.innerText = `${
      authors[activeBook.author]
    } (${new Date(activeBook.published).getFullYear()})`;
    htmlElements.dataListDescription.innerText = activeBook.description;
  }
});

// P.S. I hated this me no likey, I've had 50 tabs open this week
