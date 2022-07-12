// LOGOUT
const token = window.localStorage.getItem("token");

if (!token) {
  window.location.replace("login.html");
}

logoutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("login.html");
});

// GETTING INFORMATION
const elTemplate = document.querySelector(".template").content;
const elList = document.querySelector(".list");
const elInput = document.querySelector(".input");
const elOrderBtn = document.querySelector(".order-btn");

const API_KEY = "100309833358573903132";
let search = "Python";
let page = 1;
let startIndex = (page - 1) * 10 + 1;
let order = "";

const renderBooks = function (arr, htmlElement) {
  const booksFragment = document.createDocumentFragment();

  elList.innerHTML = null;

  arr.forEach((item) => {
    const clonedBookTemplate = elTemplate.cloneNode(true);

    const readBtn = clonedBookTemplate.querySelector(".read-btn");
    const bookmarkBtn = clonedBookTemplate.querySelector(".bookmark-btn");

    clonedBookTemplate.querySelector(".book__img").src =
      item.volumeInfo?.imageLinks.smallThumbnail;
    clonedBookTemplate.querySelector(".book__title").textContent =
      item.volumeInfo?.title;
    clonedBookTemplate.querySelector(".book__author").textContent =
      item.volumeInfo?.authors;
    clonedBookTemplate.querySelector(".book__year").textContent =
      item.volumeInfo?.publishedDate;
    clonedBookTemplate.querySelector(".bookmark-btn").textContent = "Bookmark";
    clonedBookTemplate.querySelector(".more-info-btn").textContent =
      "More info";
    clonedBookTemplate.querySelector(".read-btn").textContent = "Read";

    readBtn.setAttribute("href", item.volumeInfo?.previewLink);
    bookmarkBtn.dataset.bookmarkBtnId = item.id;

    booksFragment.appendChild(clonedBookTemplate);
  });

  htmlElement.appendChild(booksFragment);

  // console.log(arr);
};

const getBooks = async function () {
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}${order}`
  );

  const data = await request.json();

  renderBooks(data.items, elList);

  page === 1 ? (prevBtn.disabled = true) : (prevBtn.disabled = false);

  const totalPageResult = Math.ceil(data.totalItems / 10);
  // console.log(totalPageResult);

  page === totalPageResult
    ? (nextBtn.disabled = true)
    : (nextBtn.disabled = false);

  pagination.innerHTML = null;

  for (let i = 1; i <= totalPageResult; i++) {
    let htmlLi = `
      <li class="page-item"><a class="page-link">${i}</a></li>
    `;

    if (page == i) {
      htmlLi = `
      <li class="page-item active"><a class="page-link">${i}</a></li>
    `;
    } else {
      htmlLi = `
      <li class="page-item"><a class="page-link">${i}</a></li>
    `;
    }

    pagination.insertAdjacentHTML("beforeend", htmlLi);
  }
};

getBooks();

elInput.addEventListener("change", function () {
  const inputValue = elInput.value;

  search = inputValue;

  getBooks();
});

prevBtn.addEventListener("click", function () {
  page--;
  getBooks();
});

nextBtn.addEventListener("click", function () {
  page++;
  getBooks();
});

const elPagination = document.querySelector("#pagination");

elPagination.addEventListener("click", function (evt) {
  page = Number(evt.target.textContent);
  getBooks();
});

elOrderBtn.addEventListener("click", function () {
  order = "&orderBy=newest";
  getBooks();
});

// BOOKMARK
const elBookmarkList = document.querySelector(".bookmark-list");

const bookmarks = [];

elBookmarkList.addEventListener("click", function (evt) {
  if (evt.target.matches(".deleteBookmarkBtn")) {
    const bookmarkDeleteBtnId = evt.target.dataset.deleteBookmarkBtnId;
    const foundBookmarkDeleteIndex = bookmarks.findIndex(
      (bookmark) => bookmark.id === bookmarkDeleteBtnId
    );

    bookmarks.splice(foundBookmarkDeleteIndex, 1);

    elBookmarkList.innerHTML = null;

    renderBookmarks(bookmarks, elBookmarkList);
  }
});

const renderBookmarks = function (arr, htmlElement) {
  arr.forEach((bookmark) => {
    const newItem = document.createElement("li");
    const newDesc = document.createElement("p");
    const newDescTwo = document.createElement("p");
    const newOpenBookmarkBtn = document.createElement("img");
    const newRemoveBookmarkBtn = document.createElement("img");
    const newLink = document.createElement("a");

    // console.log(bookmark);

    newDesc.textContent = bookmark.volumeInfo?.title;
    newDescTwo.textContent = bookmark.volumeInfo?.authors;

    newItem.setAttribute("class", "bookmarkBox");
    newDesc.setAttribute("class", "bookmarkDesc");
    newLink.setAttribute("href", bookmark.volumeInfo?.previewLink);
    newDescTwo.setAttribute("class", "bookmarkDescTwo");
    newRemoveBookmarkBtn.setAttribute("class", "deleteBookmarkBtn");
    newRemoveBookmarkBtn.setAttribute("src", "/img/delete.png");
    newOpenBookmarkBtn.setAttribute("class", "openBookmarkBtn");
    newOpenBookmarkBtn.setAttribute("src", "/img/open.png");

    newRemoveBookmarkBtn.dataset.deleteBookmarkBtnId = bookmark.id;

    htmlElement.appendChild(newItem);
    newItem.appendChild(newDesc);
    newItem.appendChild(newDescTwo);
    newItem.appendChild(newLink);
    newLink.appendChild(newOpenBookmarkBtn);
    newItem.appendChild(newRemoveBookmarkBtn);
  });
};

elList.addEventListener("click", async function (evt) {
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${startIndex}${order}`
  );

  const data = await request.json();

  // console.log(data.items);

  if (evt.target.matches(".bookmark-btn")) {
    const bookmarkBtnId = evt.target.dataset.bookmarkBtnId;
    const foundBookmark = data.items.find((book) => book.id === bookmarkBtnId);

    if (!bookmarks.includes(foundBookmark)) {
      bookmarks.push(foundBookmark);

      elBookmarkList.innerHTML = null;

      renderBookmarks(bookmarks, elBookmarkList);
    }
  }
});
