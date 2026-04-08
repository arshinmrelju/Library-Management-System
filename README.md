# 🏛️ Navodayam Library Web App

Navodayam Library is a professional, mobile-first digital library assistant designed for rural communities. It provides an intuitive interface for users to browse books, locate them on physical shelves, and request titles seamlessly. The app is powered by **Firebase** for real-time data synchronization and secure administrative control.

## ✨ Key Features

- **📱 Professional Mobile-First UI**: Clean, modern design tailored for smartphones, using fast-loading inline SVG icons and fluid layout spacing.
- **🚀 High Performance & Pagination**: Optimized to handle large collections (5,000+ books). Uses paginated data loading, fetching manageable chunks to maintain lightning-fast render speeds.
- **📚 Standardized Categorization**: Browse an organized collection by verified categories such as *Novel, Stories, Reference, Poem, Children Literature, Literature, Politics, and Study Materials*.
- **🌐 Multilingual Catalog**: Built-in language mapping support for Malayalam, English, and Hindi to serve diverse community needs.
- **📍 Physical Book Mapping**: Visual guides to help users find books on specific shelves and sections.
- **📥 Frictionless Requests**: Users enter their Name and Phone Number to request a book; no complex account creation needed.
- **📊 Complete Admin & Member Management**: A feature-rich admin dashboard to manage inventory, track member activity, and view comprehensive borrowing histories (borrowed, returned, pending, rejected).
- **🔄 Seamless Data Sync**: Includes an optimized Google Apps Script that syncs large datasets from Google Sheets to Firestore via robust paginated batch operations.

## 🚀 Getting Started

### 1. Prerequisites
- A modern web browser.
- A **Firebase Project** (Create one at [console.firebase.google.com](https://console.firebase.google.com/)).

### 2. Configuration
1. Enable **Firestore Database** and **Authentication** (Email/Password) in your Firebase Console.
2. In your Project Settings, register a Web App and copy the `firebaseConfig` object.
3. Open `public/js/firebase-config.js` and paste your configuration.

### 3. Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/arshinmrelju/Navodaya-Library.git
   ```
2. Open `public/index.html` in your browser (use a local server like VS Code Live Server for the best experience with JS Modules).
3. Access the Librarian Portal at `public/admin.html`.

## 🛠️ Technical Stack
- **Frontend**: HTML5, CSS3 (Custom Design System, Flexbox/Grid, optimized inline SVGs)
- **Logic**: Vanilla JavaScript (ES6 Modules)
- **Backend/Database**: Firebase (Firestore & Authentication)
- **Data Pipeline**: Google Apps Script (Batch Data Sync)

## ⚖️ License
This project is open-source and designed for community use.