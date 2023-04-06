
const books = [];
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function triggerIsCompleted(){
var checkBox = document.getElementById('inputBookIsComplete');
var buttonSubmit = document.getElementById('bookSubmit');
if (checkBox.checked == true){
    buttonSubmit.innerText = 'Masukkan Buku ke rak Sudah Selesai Dibaca';
  } else {
    buttonSubmit.innerText = 'Masukkan Buku ke rak Belum Selesai Dibaca';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  alert('Welcome to Ohara Library')
	const submitForm = document.getElementById('inputBook');
	submitForm.addEventListener('submit', function (event) {
	event.preventDefault();
	addBook();
	});

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
    const completedBooksList = document.getElementById('completeBookshelfList');
    const uncompletedBooksList = document.getElementById('incompleteBookshelfList');
    completedBooksList.innerHTML='';
    uncompletedBooksList.innerHTML = '';
    for (const bookItem of books) {
	    const bookElement = makeBook(bookItem);
        if(bookItem.isComplete){
            completedBooksList.append(bookElement);
        }
        else{
            uncompletedBooksList.append(bookElement);
        }
	    
    }
    });


function addBook() {
  const title = document.getElementById('inputBookTitle').value;
	const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const checkBox = document.getElementById('inputBookIsComplete').checked
	const generatedID = generateId();
	const bookObject = generateBookObject(generatedID, title, author, year, checkBox);
	books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
  }

function searchBook(){
  const input = document.getElementById('searchBookTitle').value
  filter = input.toUpperCase();
  bookItems = document.getElementsByClassName("book_item");
  for(var i =0; i<bookItems.length;i++){
    inners = bookItems[i].getElementsByClassName("inner");
    titles = inners[0].getElementsByTagName("h3");
    title = titles[0].innerText.toUpperCase();
    if(title.indexOf(filter) > -1){
        bookItems[i].style.display="";
    }
    else{
      bookItems[i].style.display="none";
    }
  }
}



function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isCompleted,
    }
}
    
   //------------------------------------------------------------------------------------------

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const buttonAction = document.createElement('div');
    buttonAction.classList.add('action'); 
    const btnGreen = document.createElement('button');
    btnGreen.classList.add('green');
    if(bookObject.isComplete){
        btnGreen.innerText = "Belum Selesai dibaca";
        btnGreen.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
            });
    }
    else{
        btnGreen.innerText = "Selesai dibaca";
        btnGreen.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
            });
    }
    
    const btnRed = document.createElement('button');
    btnRed.addEventListener('click', function () {
        removeBook(bookObject.id);
        });
    btnRed.innerText = "Hapus Buku";
    btnRed.classList.add('red');
    buttonAction.append(btnGreen,btnRed)
    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
    container.append(buttonAction)
   
    return container;
  }

  function addBookToCompleted(bookId) {
    // ...
    const bookTarget = findBook(bookId);
	if (bookTarget == null) return;
	bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
  function removeBookFromCompleted(bookId) {
    // ...
    const bookTarget = findBook(bookId);
	if (bookTarget == null) return;
	bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBook(bookId){
    // ...
    for(var i =0;i<books.length;i++){
        if(books[i].id == bookId){
            books.splice(i,1)
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function findBook(bookID) {
	for (const bookItem of books) {
		if (bookItem.id === bookID) {
			return bookItem;
		}
	}
	return null;
}
   
   
 //------------------------------------------------------------------

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }


 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
      console.log(books);
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }