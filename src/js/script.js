const select = {
  templateOf: {
    bookTemplate: '#template-book', //tutaj mam szablon handlebar dla pojedynczej ksiazki
    booksPanelBooksList: '.books-list', //tutaj chce sobie podpiac ksiazki
    filters: '.filters'
  },
};

const templates = {
  bookTemplateProduct: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML)
};

const favouriteBooks = [];
const filters = [];

function render() {
  for (const bookParam in dataSource.books) {

    // wywoluje handlebars compile na na wlasciwosciach pojedynczej ksiazki bo tak mozna ze skladni for in
    const generateHTML = templates.bookTemplateProduct(dataSource.books[bookParam]);

    //przerabiam to na element DOM
    const bookDOM = utils.createDOMFromHTML(generateHTML);

    //tu mam selektor do listy ksiazek do ktorej chce podpinac
    const booksContainer = document.querySelector(select.templateOf.booksPanelBooksList);

    // do listy ksiazek podpinam pojedynczy element DOM
    booksContainer.appendChild(bookDOM);
  }
}

function initActions() {

  //znajduje sobie po klasie wszystkie ksiazki w ktore chce kliknacs
  //   const booksList = document.querySelectorAll('.books-list .book__image');
  const books = document.querySelector('.books-list');
  const filtersForm = document.querySelector(select.templateOf.filters);


  books.addEventListener('dblclick', function (e) {
    // nasluchiwanie jest na caly kontener a ponizej mam znalezc najblizszego przodka ktory ma book__image
    const thisBook = e.target.offsetParent;

    if(thisBook.classList.contains('book__image')){
      const bookId = thisBook.getAttribute('data-id');

      if (!favouriteBooks.includes(bookId)){
        thisBook.classList.add('favorite');
        console.log(bookId);
        favouriteBooks.push(bookId);
        console.log(favouriteBooks);
      }else {
        // z tablicy ulubionych ksiazek usun 1 pozycje do przodu od tej ktorej index to bookId
        favouriteBooks.splice(favouriteBooks.indexOf(bookId),1);
        thisBook.classList.remove('favorite');
        console.log(favouriteBooks);
      }
    }
  });

  filtersForm.addEventListener('click', function (e) {
    console.log(e.target.tagName == 'INPUT' && e.target.type == 'checkbox' && e.target.name == 'filter');
    console.log(e.target.value);

    if (e.target.checked) {
      console.log('input jest checked');
      filters.push(e.target.value);
      console.log(filters);
      // filterBooks();

    } else {
      filters.splice(filters.indexOf(!e.target.checked),1);
      console.log(filters);
      // filterBooks();
    }
    filterBooks();
  });


}

function filterBooks() {

  let shouldBeHidden = false;

  for (const book of dataSource.books) {
    // console.log(book);

    for (const filter of filters) {
      if (!book.details[filter]) {
        shouldBeHidden = true;
        break;
      }
    }

    if (shouldBeHidden) {
      document.querySelector('.book__image' + '[data-id="' + book.id + '"]').classList.add('hidden');
    } else {
      document.querySelector('.book__image' + '[data-id="' + book.id + '"]').classList.remove('hidden');
    }

  }
}

render();
initActions();







