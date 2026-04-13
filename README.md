# 🏛️ Navodhayam Library Web App

Navodhayam Library is a professional, mobile-first digital library assistant designed for rural communities. It provides an intuitive interface for users to browse books, locate them on physical shelves, and request titles seamlessly. The app is powered by **Firebase** for real-time data synchronization and secure administrative control.

## ✨ Key Features

### 👤 User Interface & Experience
- **📱 Premium PWA Experience**: Fully optimized Progressive Web App with custom installation prompts for Android, Desktop, and iOS. Supports offline access and "Add to Home Screen" functionality.
- **📱 Professional Mobile-First UI**: Clean, modern design tailored for smartphones, using fast-loading inline SVG icons and fluid layout spacing.
- **🚀 Glassmorphism Design System**: Harmonious color palettes, blurred backdrops, and subtle micro-animations for a premium, native-app feel.
- **📷 Book Cover Scanning**: Integrated WhatsApp-style document scanner allowing users to snap, crop, and upload book covers directly from mobile devices.

### 📚 Library Catalog
- **🚀 High Performance & Pagination**: Optimized to handle large collections (5,000+ books) via paginated data loading, fetching manageable chunks to maintain lightning-fast render speeds.
- **🔍 Multi-Dimensional Search**: Premium search dropdown interfaces supporting multi-criteria queries by Book ID, Member ID, Author name, and Title.
- **🌐 Multilingual Support**: Built-in language mapping support for Malayalam, English, and Hindi to serve diverse community needs.
- **📍 Physical Book Mapping**: Visual guides to help users find books on specific shelves and sections.
- **📥 Frictionless Requests**: Users enter their Name and Phone Number to request a book; no complex account creation needed.

### 🔐 Admin & Management
- **📊 Complete Admin Dashboard**: A feature-rich secure portal to manage inventory, track member activity, approve new memberships, and manage the full borrowing lifecycle.
- **🔔 Advanced Alerting System**: 
    - **🎙️ Malayalam Voice Alerts**: Automated audio notifications in natural-sounding Malayalam for new requests.
    - **📲 OS Push Notifications**: Browser-level alerts for real-time administrative monitoring, even when the tab is in the background.
- **🛠️ Debug & Sync Tools**: Hidden Secret Sync Panel (revealed by triple-tapping the header title) for real-time monitoring of Google Sheets integration data flow and manual PWA test triggers.
- **🚀 Direct Admin Borrowing**: Assign books directly to members from the admin panel with intuitive, custom-branded confirmation modals.
- **🔄 Real-Time UI Updates**: Instantaneous UI reflection for approvals, returns, and issues without page refreshes, powered by Firestore live listeners.
- **📑 Reporting & PDF Exports**: Manage comprehensive borrowing histories with one-click PDF generation for offline records.

## 🚀 Getting Started

### 1. Prerequisites
- A modern web browser (Chrome/Safari recommended for PWA features).
- A **Firebase Project** (Create one at [console.firebase.google.com](https://console.firebase.google.com/)).

### 2. Configuration
1. Enable **Firestore Database**, **Authentication** (Google & Email/Password), and **Storage** in your Firebase Console.
2. In your Project Settings, register a Web App and copy the `firebaseConfig` object.
3. Open `public/js/firebase-config.js` and paste your configuration.

### 3. Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/arshinmrelju/Navodaya-Library.git
   ```
2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```
3. Access the Librarian Portal at `public/admin.html`.

## 🛠️ Technical Stack
- **Frontend**: HTML5, CSS3 (Glassmorphism Design System, Lucide Icons, Custom SVG Symbols)
- **Logic**: Vanilla JavaScript (ES6 Modules, Service Workers, Web Speech API, Notification API)
- **Backend/Database**: Firebase (Firestore, Authentication, Storage, Hosting)
- **Data Pipeline**: Google Apps Script (Batch Data Sync from Google Sheets)
- **Mobile/Native**: Capacitor (for APK generation support)

## ⚖️ License
This project is open-source and designed for community use. Developed by Dept. of English Interns at **Pazhassiraja College**.