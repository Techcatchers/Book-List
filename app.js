class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</td>
        `

        list.appendChild(row);
        // console.log(row)
    }

    showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.textContent = msg;

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    
    deleteBook(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();    
            this.showAlert('Book Removed Successfully', 'success');
        }
    }
    
    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Store {
    static getBooks() {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => {
            const ui = new UI();
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book['isbn'] === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Check Local Storage onload
document.addEventListener('DOMContentLoaded', Store.displayBooks());

document.querySelector('#book-form').addEventListener('submit', (e) => {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    
    const book = new Book(title, author, isbn);
    
    const ui = new UI();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please Fill in the Following Details', 'error')
    } else {
        ui.addBookToList(book);

        // Store locally
        Store.addBook(book);

        ui.clearFields();
        ui.showAlert('Book Added Successfully', 'success');
    }
    
    e.preventDefault();
})

document.querySelector('#book-list').addEventListener('click', (e) => {
    // console.log(e);

    const ui = new UI();
    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
    e.preventDefault();
})