// Imports data from data.js
import { books, authors, BOOKS_PER_PAGE } from "../data.js";

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
}
