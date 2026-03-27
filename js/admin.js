// Admin Logic
let currentView = 'requests-view';

const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');

function initAdmin() {
    // Check if admin is authenticated via sessionStorage
    if (sessionStorage.getItem('navodaya_admin_auth') === 'true') {
        showApp();
    }
    
    // Login form logic
    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('admin-password').value;
        if (pwd === 'c') { // As per user instructions, password is 'c'
            sessionStorage.setItem('navodaya_admin_auth', 'true');
            showApp();
        } else {
            alert('Incorrect password. Try "c"');
        }
    });
}

function showApp() {
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    setupListeners();
    renderRequests();
    renderBorrows();
    renderInventory();
}

window.logout = function() {
    sessionStorage.removeItem('navodaya_admin_auth');
    window.location.reload();
};

function setupListeners() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            navigateTo(item.dataset.target);
        });
    });
}

function navigateTo(viewId) {
    views.forEach(view => view.classList.remove('active-view'));
    document.getElementById(viewId).classList.add('active-view');
    currentView = viewId;
    
    if(viewId === 'requests-view') {
        renderRequests();
        renderBorrows();
    } else {
        renderInventory();
    }
}

// ---------------------------
// REQUESTS & BORROWS
// ---------------------------
function renderRequests() {
    const list = document.getElementById('pending-list');
    list.innerHTML = '';
    
    const pendings = libraryData.requests.filter(r => r.status === 'pending');
    
    if (pendings.length === 0) {
        list.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">No pending requests.</p>';
        return;
    }
    
    pendings.forEach(req => {
        const book = libraryData.books.find(b => b.id === req.bookId);
        if(!book) return;
        
        const card = document.createElement('div');
        card.className = 'book-card req-card';
        card.innerHTML = `
            <div class="req-header">
                <span><strong>${req.userName}</strong> (${req.userPhone})</span>
                <span>${window.formatDate(req.timestamp)}</span>
            </div>
            <div class="req-body">
                <div class="book-img-placeholder" style="background-color: ${book.color}20; color: ${book.color}; width:50px; height:70px; font-size:18px;">
                    ${book.image}
                </div>
                <div class="book-info">
                    <h3 class="book-title" style="font-size:14px;">${book.title}</h3>
                </div>
            </div>
            <div class="req-actions">
                <button class="btn btn-primary" style="padding: 8px 16px; font-size:14px; flex:1;" onclick="processRequest(${req.id}, 'approved')">Approve</button>
                <button class="btn btn-danger" style="padding: 8px 16px; font-size:14px; flex:1;" onclick="processRequest(${req.id}, 'rejected')">Reject</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderBorrows() {
    const list = document.getElementById('borrowed-list');
    list.innerHTML = '';
    
    const borrows = libraryData.requests.filter(r => r.status === 'approved');
    
    if (borrows.length === 0) {
        list.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">No active borrows.</p>';
        return;
    }
    
    borrows.forEach(req => {
        const book = libraryData.books.find(b => b.id === req.bookId);
        if(!book) return;
        
        const card = document.createElement('div');
        card.className = 'book-card req-card';
        card.innerHTML = `
            <div class="req-header">
                <span><strong>${req.userName}</strong> (${req.userPhone})</span>
                <span>Borrowed</span>
            </div>
            <div class="req-body">
                <div class="book-img-placeholder" style="background-color: ${book.color}20; color: ${book.color}; width:50px; height:70px; font-size:18px;">
                    ${book.image}
                </div>
                <div class="book-info">
                    <h3 class="book-title" style="font-size:14px;">${book.title}</h3>
                </div>
            </div>
            <div class="req-actions">
                <button class="btn" style="background:#e0e0e0; color:black; padding: 8px 16px; font-size:14px; flex:1;" onclick="processRequest(${req.id}, 'returned')">Mark Returned</button>
            </div>
        `;
        list.appendChild(card);
    });
}

window.processRequest = function(reqId, newStatus) {
    const req = libraryData.requests.find(r => r.id === reqId);
    if(req) {
        req.status = newStatus;
        if (newStatus === 'rejected' || newStatus === 'returned') {
            const book = libraryData.books.find(b => b.id === req.bookId);
            if(book) book.available = true;
        }
        window.saveLibraryData();
        renderRequests();
        renderBorrows();
        if(currentView === 'inventory-view') renderInventory();
    }
}

// ---------------------------
// INVENTORY
// ---------------------------
function renderInventory() {
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';
    
    libraryData.books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.alignItems = 'center';
        card.innerHTML = `
            <div class="book-img-placeholder" style="background-color: ${book.color}20; color: ${book.color}">
                ${book.image}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <span class="status-badge ${book.available ? 'status-available' : 'status-borrowed'}">
                    ${book.available ? 'Available' : 'Unavailable'}
                </span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="edit-book-btn" onclick="openBookForm(${book.id})" title="Edit Book">✏️</button>
                <button class="delete-book-btn" onclick="deleteBook(${book.id})" title="Delete Book">🗑️</button>
            </div>
        `;
        list.appendChild(card);
    });
}

window.openBookForm = function(bookId = null) {
    const formContainer = document.getElementById('book-form-container');
    const title = document.getElementById('book-form-title');
    const idField = document.getElementById('edit-book-id');
    const titleField = document.getElementById('new-title');
    const authorField = document.getElementById('new-author');
    const sectionField = document.getElementById('new-section');
    const shelfField = document.getElementById('new-shelf');
    const rowField = document.getElementById('new-row');

    if (bookId) {
        const book = libraryData.books.find(b => b.id === bookId);
        if (book) {
            title.textContent = 'Edit Book';
            idField.value = book.id;
            titleField.value = book.title;
            authorField.value = book.author;
            sectionField.value = book.location?.section || '';
            shelfField.value = book.location?.shelf || '';
            rowField.value = book.location?.row || '';
        }
    } else {
        title.textContent = 'New Book';
        idField.value = '';
        titleField.value = '';
        authorField.value = '';
        sectionField.value = '';
        shelfField.value = '';
        rowField.value = '';
    }
    
    formContainer.style.display = 'block';
};

window.closeBookForm = function() {
    document.getElementById('book-form-container').style.display = 'none';
};

window.saveBook = function() {
    const editId = document.getElementById('edit-book-id').value;
    const title = document.getElementById('new-title').value.trim();
    const author = document.getElementById('new-author').value.trim();
    
    const section = document.getElementById('new-section').value.trim();
    const shelf = document.getElementById('new-shelf').value.trim();
    const row = document.getElementById('new-row').value.trim();
    
    if(!title || !author) {
        alert("Please enter title and author");
        return;
    }
    
    const locationObj = { section, shelf, row };
    
    if (editId) {
        const book = libraryData.books.find(b => b.id === parseInt(editId));
        if (book) {
            book.title = title;
            book.author = author;
            book.location = locationObj;
        }
    } else {
        const newBook = {
            id: Date.now(),
            title: title,
            author: author,
            description: "Added by librarian.",
            image: "📖", 
            color: "#607d8b",
            location: locationObj,
            available: true
        };
        libraryData.books.push(newBook);
    }
    
    window.saveLibraryData();
    closeBookForm();
    renderInventory();
};

window.deleteBook = function(bookId) {
    if (confirm("Are you sure you want to delete this book?")) {
        // Remove book
        libraryData.books = libraryData.books.filter(b => b.id !== bookId);
        // Also clean up related requests if desired (optional but good practice)
        libraryData.requests = libraryData.requests.filter(r => r.bookId !== bookId);
        
        window.saveLibraryData();
        renderInventory();
        renderRequests();
        renderBorrows();
    }
};

document.addEventListener('DOMContentLoaded', initAdmin);
