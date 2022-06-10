const select = {
  templateOf: {
    bookTemplate: '#template-book', //tutaj mam szablon handlebar dla pojedynczej ksiazki
    booksPanelBooksList: '.books-list', //tutaj chce sobie podpiac ksiazki
    filters: '.filters',
    bookRatingFill: '.book__rating__fill'
  },
};

const templates = {
  bookTemplateProduct: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML)
};

const favouriteBooks = [];
const filters = [];

class BooksList {
  constructor() {
    const thisBookslist = this;

    thisBookslist.initData();
    thisBookslist.getElements();
    thisBookslist.initActions();
    thisBookslist.filterBooks();

  }
  initData() {
    const thisBookslist = this;
    thisBookslist.data = dataSource.books;

    for ( const bookParam in thisBookslist.data){
      const bookRatingFill = document.querySelector(select.templateOf.bookRatingFill);
      console.log(bookRatingFill);

      // tutaj jest rating kazdej ksiazki
      const rating = thisBookslist.data[bookParam].rating;
      console.log('rating : ', rating);

      const ratingBgc = thisBookslist.determineRatingBgc(rating);
      const ratingWidth = rating * 10;

      thisBookslist.data[bookParam].ratingBgc = ratingBgc;
      thisBookslist.data[bookParam].ratingWidth = ratingWidth;

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

  getElements() {
    const thisBookslist = this;
    thisBookslist.bookslist = document.querySelector('.books-list');
    thisBookslist.filtersForm = document.querySelector(select.templateOf.filters);
    thisBookslist.bookRatingFill = document.querySelector(select.templateOf.bookRatingFill);

  }

  initActions() {
    const thisBookslist = this;
    thisBookslist.bookslist.addEventListener('dblclick', function (e) {
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

    thisBookslist.filtersForm.addEventListener('click', function (e) {

      const formFilter = e.target;

      console.log(formFilter.tagName == 'INPUT' && formFilter.type == 'checkbox' && formFilter.name == 'filter');
      console.log(formFilter.value);

      if (formFilter.checked) {
        console.log('input jest checked');
        filters.push(e.target.value);
        console.log(filters);
        // filterBooks();

      } else {
        filters.splice(filters.indexOf(!formFilter.checked),1);
        console.log(filters);
        // filterBooks();
      }
      thisBookslist.filterBooks();
    });


  }

  filterBooks() {

    const thisBookslist = this;
    for (const book of thisBookslist.data) {
      console.log(book);
      let shouldBeHidden = false;
      for (const filter of filters) {
        if (!book.details[filter]) {
          console.log(book.details[filter]);
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


  determineRatingBgc(rating) {

    // eslint-disable-next-line no-unused-vars
    const thisBookslist = this;

    let ratingBgc = '';

    if (rating < 6) {
      ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }

    return ratingBgc;

  }

}

// eslint-disable-next-line no-unused-vars
const app = new BooksList();







