class LocalStorageORM {
    constructor(databaseName, schema) {
        this.LsWebORM = LsWebORM.getInstance(databaseName, localStorage, schema);
    }

    addUser(name) {
        this.LsWebORM.insert('users', { name });
    }

    addBook(title, authorId) {
        this.LsWebORM.insert('books', { title, authorId: parseInt(authorId) });
    }

    getUsers() {
        return this.LsWebORM.all('users');
    }

    getBooks() {
        return this.LsWebORM.select('books', {}, true); // Populate authors
    }

    updateUser(userId, updatedData) {
        this.LsWebORM.update('users', { _id: userId }, updatedData);
    }

    updateBook(bookId, updatedData) {
        this.LsWebORM.update('books', { _id: bookId }, updatedData);
    }

    deleteUser(userId) {
        this.LsWebORM.delete('users', { _id: userId });
    }

    deleteBook(bookId) {
        this.LsWebORM.delete('books', { _id: bookId });
    }
}

// Initial Setup
const databaseName = 'libraryDB';
const schema = {
    users: {
        table: 'users',
        attributes: { name: { type: 'string' } },
        autoIncrement: true
    },
    books: {
        table: 'books',
        attributes: {
            title: { type: 'string' },
            authorId: { type: 'number' }
        },
        relationships: [
            {
                type: 'many-to-one',
                relatedTable: 'users',
                localKey: 'authorId',
                foreignKey: '_id'
            }
        ],
        autoIncrement: true
    }
};

// class User {

//     attributes = ['name'];
//     options = {
//         autoIncrement: false
//     };
// }
// User.select();
// books

const db = new LocalStorageORM(databaseName, schema);

// DOM Elements
const userForm = document.getElementById('userForm');
const bookForm = document.getElementById('bookForm');
const usersTable = document.getElementById('usersTable').querySelector('tbody');
const booksTable = document.getElementById('booksTable').querySelector('tbody');
const authorSelect = document.getElementById('author');
const editUserModal = document.getElementById('editUserModal');
const editBookModal = document.getElementById('editBookModal');
const editUserForm = document.getElementById('editUserForm');
const editBookForm = document.getElementById('editBookForm');
const editUserNameInput = document.getElementById('editUserName');
const editBookTitleInput = document.getElementById('editBookTitle');
const editAuthorSelect = document.getElementById('editAuthor');
let currentEditUserId = null;
let currentEditBookId = null;

// Functions
function renderUsers() {
    const users = db.getUsers();
    usersTable.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td class="actions">
                <button onclick="openEditUserModal(${user._id}, '${user.name}')">Edit</button>
                <button onclick="deleteUser(${user._id})">Delete</button>
            </td>
        `;
        usersTable.appendChild(row);
    });

    renderAuthorSelect(users);
}

function renderBooks() {
    const books = db.getBooks();
    booksTable.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.users ? book.users.name : 'Unknown'}</td>
            <td class="actions">
                <button onclick="openEditBookModal(${book._id}, '${book.title}', ${book.authorId})">Edit</button>
                <button onclick="deleteBook(${book._id})">Delete</button>
            </td>
        `;
        booksTable.appendChild(row);
    });
}

function renderAuthorSelect(users) {
    authorSelect.innerHTML = '';
    editAuthorSelect.innerHTML = '';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.name;
        authorSelect.appendChild(option);

        const editOption = option.cloneNode(true);
        editAuthorSelect.appendChild(editOption);
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        db.deleteUser(userId);
        renderUsers();
    }
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        db.deleteBook(bookId);
        renderBooks();
    }
}

function openEditUserModal(userId, userName) {
    currentEditUserId = userId;
    editUserNameInput.value = userName;
    editUserModal.style.display = 'block';
}

function openEditBookModal(bookId, bookTitle, authorId) {
    currentEditBookId = bookId;
    editBookTitleInput.value = bookTitle;
    editAuthorSelect.value = authorId;
    editBookModal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Event Listeners
userForm.addEventListener('submit', event => {
    event.preventDefault();
    const userName = document.getElementById('userName').value;
    db.addUser(userName);
    userForm.reset();
    renderUsers();
});

bookForm.addEventListener('submit', event => {
    event.preventDefault();
    const bookTitle = document.getElementById('bookTitle').value;
    const authorId = authorSelect.value;
    db.addBook(bookTitle, authorId);
    bookForm.reset();
    renderBooks();
});

editUserForm.addEventListener('submit', event => {
    event.preventDefault();
    const updatedName = editUserNameInput.value;
    db.updateUser(currentEditUserId, { name: updatedName });
    closeModal(editUserModal);
    renderUsers();
});

editBookForm.addEventListener('submit', event => {
    event.preventDefault();
    const updatedTitle = editBookTitleInput.value;
    const updatedAuthorId = editAuthorSelect.value;
    db.updateBook(currentEditBookId, { title: updatedTitle, authorId: updatedAuthorId });
    closeModal(editBookModal);
    renderBooks();
});

window.addEventListener('click', event => {
    if (event.target === editUserModal) {
        closeModal(editUserModal);
    } else if (event.target === editBookModal) {
        closeModal(editBookModal);
    }
});

// Close modal on close button click
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeModal(closeBtn.closest('.modal'));
    });
});

// Initial Render
renderUsers();
renderBooks();
