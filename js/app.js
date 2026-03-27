let currentUser = null;
let currentView = 'welcome-view';
let pendingRequestBookId = null;

// DOM Elements
const views = document.querySelectorAll('.view');
const headerTitle = document.getElementById('header-title');
const navItems = document.querySelectorAll('.nav-item');

function initApp() {
    const userStr = localStorage.getItem('navodaya_user');
    if (userStr) {
        currentUser = JSON.parse(userStr);
    }
    setupEventListeners();
    navigateTo('welcome-view');
}

function setupEventListeners() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            navigateTo(target);
        });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        renderLibraryView(e.target.value.toLowerCase());
    });

    document.getElementById('back-to-library').addEventListener('click', () => {
        navigateTo('library-view');
        updateNavActive('library-view');
    });

    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value;
        const phone = document.getElementById('user-phone').value;
        
        currentUser = { name, phone };
        localStorage.setItem('navodaya_user', JSON.stringify(currentUser));
        
        closeAuthModal();

        // If auth was triggered by a book request, process it now
        if (pendingRequestBookId) {
            processRequestBook(pendingRequestBookId);
            pendingRequestBookId = null;
        } else {
            // It was triggered by "My Books" tab
            renderMyBooksView();
        }
    });
}

function navigateTo(viewId, action = null) {
    views.forEach(view => view.classList.remove('active-view'));
    document.getElementById(viewId).classList.add('active-view');
    currentView = viewId;

    const header = document.getElementById('app-header');
    const bottomNav = document.getElementById('bottom-nav');

    if (viewId === 'welcome-view') {
        header.style.display = 'none';
        bottomNav.style.display = 'none';
    } else {
        header.style.display = 'block';
        bottomNav.style.display = 'flex';
    }

    if (viewId === 'library-view') {
        headerTitle.textContent = `Library`;
        renderLibraryView();
        if (action === 'focus-search') {
            document.getElementById('search-input').focus();
        }
    } else if (viewId === 'map-view') {
        headerTitle.textContent = 'Digital Map';
    } else if (viewId === 'my-books-view') {
        headerTitle.textContent = 'My Books';
        if (!currentUser) {
            // Ask for phone number to view their books
            openAuthModal("Enter details to view your books");
            // Show message in the view meanwhile
            document.getElementById('borrowed-list').innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <button class="btn btn-primary" onclick="openAuthModal('Enter details to view your books')">Identify Yourself</button>
                    <p style="margin-top:16px; color:var(--text-secondary);">Enter your phone number to see your requests.</p>
                </div>
            `;
            document.getElementById('my-books-header').innerHTML = '';
        } else {
            renderMyBooksView();
        }
    }
}

function updateNavActive(viewId) {
    navItems.forEach(nav => {
        if(nav.dataset.target === viewId) nav.classList.add('active');
        else nav.classList.remove('active');
    });
}

// ---------------------------
// LIBRARY CATALOG
// ---------------------------
function renderLibraryView(searchQuery = '') {
    const listContainer = document.getElementById('book-list');
    listContainer.innerHTML = '';
    
    const booksToRender = libraryData.books.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchQuery);
        const authorMatch = book.author.toLowerCase().includes(searchQuery);
        const sectionMatch = book.location?.section?.toLowerCase().includes(searchQuery);
        const shelfMatch = book.location?.shelf?.toLowerCase().includes(searchQuery);
        return titleMatch || authorMatch || sectionMatch || shelfMatch;
    });

    if (booksToRender.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 20px;">No books found.</p>';
        return;
    }

    // Active requests for the current user if logged in
    const targetStatuses = ['pending', 'approved'];
    let myActiveRequests = [];
    if (currentUser) {
        myActiveRequests = libraryData.requests.filter(r => 
            r.userPhone === currentUser.phone && targetStatuses.includes(r.status)
        );
    }

    booksToRender.forEach(book => {
        const myRequestForBook = myActiveRequests.find(r => r.bookId === book.id);
        
        let statusHtml = '';
        if (myRequestForBook) {
            if (myRequestForBook.status === 'pending') {
                 statusHtml = '<span class="status-badge" style="background-color:#fff3e0; color:#e65100;">Request Pending</span>';
            } else if (myRequestForBook.status === 'approved') {
                 statusHtml = '<span class="status-badge status-available" style="color:#d32f2f; background-color:#ffebee;">Borrowed</span>';
            }
        } else if (book.available) {
            statusHtml = '<span class="status-badge status-available">Available</span>';
        } else {
            statusHtml = '<span class="status-badge status-borrowed">Unavailable</span>';
        }

        let locationText = "Location not specified";
        if (book.location) {
            const parts = [];
            if (book.location.section) parts.push(book.location.section);
            if (book.location.shelf) parts.push(book.location.shelf);
            if (book.location.row) parts.push(book.location.row);
            if (parts.length > 0) locationText = parts.join(' • ');
        }

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-img-placeholder" style="background-color: ${book.color}20; color: ${book.color}">
                ${book.image}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">📍 ${locationText}</p>
                ${statusHtml}
            </div>
        `;
        
        card.addEventListener('click', () => {
            showBookDetail(book, myRequestForBook);
        });
        
        listContainer.appendChild(card);
    });
}

function showBookDetail(book, myRequestForBook) {
    const container = document.getElementById('book-detail-content');
    
    let actionBtnHtml = '';
    if (myRequestForBook) {
        if (myRequestForBook.status === 'pending') {
            actionBtnHtml = `<button class="btn btn-primary w-100" style="background-color:#fb8c00;" disabled>Request is Pending Approval</button>`;
        } else if (myRequestForBook.status === 'approved') {
             actionBtnHtml = `<button class="btn btn-primary w-100" style="background-color:#4caf50;" disabled>You Borrowed This Book</button>`;
        }
    } else if (book.available) {
        actionBtnHtml = `<button class="btn btn-primary w-100" onclick="handleRequestAction(${book.id})">Request Book</button>`;
    } else {
        actionBtnHtml = `<button class="btn btn-primary w-100" style="background-color:#9e9e9e;" disabled>Currently Unavailable</button>`;
    }

    let locationStr = "Location not specified";
    if (book.location) {
        const parts = [];
        if (book.location.section) parts.push('<b>' + book.location.section + '</b>');
        if (book.location.shelf) parts.push(book.location.shelf);
        if (book.location.row) parts.push(book.location.row + ' Row');
        if (parts.length > 0) locationStr = parts.join(' &rarr; ');
    }

    container.innerHTML = `
        <div class="detail-img-container" style="background-color: ${book.color}20; color: ${book.color}">
            ${book.image}
        </div>
        <h2 class="detail-title">${book.title}</h2>
        <p class="detail-author">By ${book.author}</p>
        
        <!-- Book Location Banner -->
        <div style="background-color:#e0f2f1; padding:12px 16px; border-radius:8px; margin-bottom:16px; border-left:4px solid var(--primary-light);">
            <p style="font-size:14px; color:#004d40; margin:0;">
                <span style="font-size:16px; margin-right:4px;">📍</span> 
                This book is in: <br>
                <span style="display:inline-block; margin-top:4px;">${locationStr}</span>
            </p>
        </div>

        <p class="detail-desc">${book.description}</p>
        <div class="detail-actions">
            ${actionBtnHtml}
        </div>
    `;
    
    navigateTo('book-detail-view');
}

// ---------------------------
// AUTH MODAL & REQUEST FLOW
// ---------------------------
window.handleRequestAction = function(bookId) {
    if (!currentUser) {
        pendingRequestBookId = bookId;
        openAuthModal("Enter details to request this book");
    } else {
        processRequestBook(bookId);
    }
};

window.openAuthModal = function(title) {
    document.getElementById('auth-modal-title').textContent = title;
    document.getElementById('auth-modal').style.display = 'flex';
};

window.closeAuthModal = function() {
    document.getElementById('auth-modal').style.display = 'none';
};

window.logoutUser = function() {
    localStorage.removeItem('navodaya_user');
    currentUser = null;
    navigateTo('library-view');
    updateNavActive('library-view');
};

function processRequestBook(bookId) {
    const book = libraryData.books.find(b => b.id === bookId);
    if (book && book.available) {
        book.available = false; // Mark unavailable globally
        
        libraryData.requests.push({
             id: Date.now(),
             userPhone: currentUser.phone,
             userName: currentUser.name,
             bookId: book.id,
             status: 'pending',
             timestamp: Date.now()
        });
        
        window.saveLibraryData();
        alert(`You requested "${book.title}". Your request is pending librarian approval.`);
        updateNavActive('my-books-view');
        navigateTo('my-books-view');
    }
}

// ---------------------------
// MY BOOKS VIEW
// ---------------------------
function renderMyBooksView() {
    const listContainer = document.getElementById('borrowed-list');
    listContainer.innerHTML = '';
    
    document.getElementById('my-books-header').innerHTML = `
        <p style="font-size:14px; margin-bottom:4px;">Logged in as: <strong>${currentUser.name}</strong> (${currentUser.phone})</p>
        <button onclick="logoutUser()" class="btn btn-danger" style="font-size:12px; padding:4px 8px;">Logout (Not Me)</button>
    `;

    const targetStatuses = ['pending', 'approved'];
    const myActiveRequests = libraryData.requests.filter(r => 
        r.userPhone === currentUser.phone && targetStatuses.includes(r.status)
    );
    
    if (myActiveRequests.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">You haven't requested any books.</p>
                <button class="btn btn-primary" onclick="navigateTo('library-view'); updateNavActive('library-view');">Browse Library</button>
            </div>
        `;
        return;
    }

    myActiveRequests.forEach(req => {
        const book = libraryData.books.find(b => b.id === req.bookId);
        if (book) {
            let statusHtml = '';
            let statusColor = '';
            let statusBg = '';
            
            if (req.status === 'pending') {
                statusHtml = 'Pending Approval';
                statusColor = '#e65100';
                statusBg = '#fff3e0';
            } else {
                statusHtml = 'Borrowed - Picked up';
                statusColor = '#d32f2f';
                statusBg = '#ffebee';
            }

            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="book-img-placeholder" style="background-color: ${book.color}20; color: ${book.color}">
                    ${book.image}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <span class="status-badge" style="color:${statusColor}; background-color:${statusBg};">${statusHtml}</span>
                </div>
            `;
            
            card.addEventListener('click', () => {
                showBookDetail(book, req);
            });
            
            listContainer.appendChild(card);
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);
