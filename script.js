const form = document.getElementById("inputBook");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const shelfName = document.getElementById("shelfName");
const formSearch = document.getElementById("searchBook");

inputBookIsComplete.addEventListener("change", (e) => {
  if (e.target.checked) {
    shelfName.textContent = "Sudah selesai dibaca";
  } else {
    shelfName.textContent = " Belum selesai dibaca";
  }
});

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const q = data.get("q");
  const books = getBooks();
  const filteredBooks = books.filter(function (book) {
    return book.title.includes(q);
  });
  renderBooks(filteredBooks);
});

function getBooks() {
  if (typeof Storage !== undefined) {
    const bookVal = localStorage.getItem("books");

    let books;
    try {
      books = JSON.parse(bookVal);
    } catch (error) {
      console.log("error");
    }

    return books;
  } else {
    alert("browser tidak support");
  }
}

function setBooks(books) {
  if (typeof Storage !== undefined) {
    localStorage.setItem("books", JSON.stringify(books));
  } else {
    alert("browser tidak support");
  }
}

function deleteBook(id) {
  const books = getBooks();
  const bookIndex = books.findIndex((book) => book.id === id);
  books.splice(bookIndex, 1);
  console.log(books);

  setBooks(books);
  renderBooks(books);
}
function changeStatus(id) {
  const books = getBooks();
  const changeBook = books.map((book) => {
    if (id == book.id) {
      return { ...book, completed: !book.completed };
    } else {
      return book;
    }
  });

  setBooks(changeBook);
  renderBooks(changeBook);
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);

  const book = {
    id: Date.now(),
    title: data.get("title"),
    author: data.get("author"),
    year: data.get("year"),
    completed: data.get("completed") === "yes",
  };

  const books = getBooks();
  // pengecekan apakah value dan key sudah ada isinya
  if (books && Array.isArray(books) && books.length) {
    console.log("sudah ada item");
    books.push(book);

    setBooks(books);
    renderBooks(books);
  } else {
    setBooks([book]);
    renderBooks([book]);
  }
  e.target.reset();
});

function createBookItem(book, index) {
  const articleBookItem = document.createElement("article");
  articleBookItem.classList.add("book_item");

  const h3Title = document.createElement("h3");
  h3Title.textContent = book.title;

  const pAuthor = document.createElement("p");
  pAuthor.textContent = `Penulis: ${book.author}`;

  const pYear = document.createElement("p");
  pYear.textContent = `Tahun terbit: ${book.year}`;

  const divAction = document.createElement("div");
  divAction.classList.add("action");

  const buttonGreen = document.createElement("button");
  buttonGreen.textContent = book.completed ? "Belum Selesai Dibaca" : "Selesai dibaca";
  buttonGreen.classList.add("green");
  buttonGreen.addEventListener("click", function () {
    changeStatus(book.id);
  });

  const buttonRed = document.createElement("button");
  buttonRed.textContent = "Hapus Buku";
  buttonRed.classList.add("red");
  buttonRed.addEventListener("click", () => {
    deleteBook(book.id);
  });

  divAction.append(buttonGreen, buttonRed);

  articleBookItem.append(h3Title, pAuthor, pYear, divAction);
  return articleBookItem;
}
function renderBooks(books) {
  const completedBooksList = document.getElementById("completeBookshelfList");
  completedBooksList.innerHTML = "";

  const inCompletedBookslist = document.getElementById("incompleteBookshelfList");
  inCompletedBookslist.innerHTML = "";

  books.forEach((book, index) => {
    const articleBookItem = createBookItem(book, index);

    if (book.completed) {
      completedBooksList.append(articleBookItem);
    } else {
      inCompletedBookslist.append(articleBookItem);
    }
  });
}

const books = getBooks();
renderBooks(books);
