# 🏛️ Navodaya Library Web App

Navodaya Library is a lightweight, mobile-first web application designed for rural communities. It provides an intuitive, WhatsApp-inspired interface for users to browse books, locate them on physical shelves, and request titles without needing a complex login system. It also features a secure Librarian Portal for tracking inventory and managing book requests.

## ✨ Features

- **📱 Mobile-First Design:** Clean, simple, and high-contrast UI tailored for mobile screens.
- **🚪 QR Code Entry:** Users can scan a QR code at the library entrance to open the app instantly.
- **📚 Smart Catalog & Search:** Browse the library or search by Title, Author, or exact Shelf Location.
- **📍 Detailed Book Mapping:** See exactly where a book is located (e.g., `Fiction • Shelf A-1 • Top Row`) alongside an interactive Digital Library Map.
- **📥 Frictionless Requests:** Users can request to borrow a book simply by entering their Name and Phone Number (no account creation required).
- **🔐 Secure Administrator Portal:** A protected interface (`admin.html`) for the librarian to Add, Edit, or Delete books and approve incoming borrow requests.
- **⚡ Offline-Ready State:** Built entirely with standard HTML, CSS, and Vanilla JavaScript using `localStorage` for blazing-fast performance.

## 🚀 Getting Started

### Prerequisites
Since the application uses standard web technologies with no backend dependencies, all you need is a modern web browser or a basic local hot server (like VS Code Live Server). 

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/arshinmrelju/Navodaya-Library.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Navodaya-Library
   ```
3. Open `index.html` in your web browser to view the user application.
4. Open `admin.html` to access the Librarian Portal. *(Default password: `c`)*

## 🛠️ Architecture
- **Frontend Core:** HTML5, CSS3 (Custom Navigation, Flexbox Layouts)
- **Logic:** Vanilla JavaScript (ES6+)
- **Storage:** Client-side Local Storage API (`navodaya_library_data`)