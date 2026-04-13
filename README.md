<p align="center">
  <img src="public/favicon.svg" width="120" height="120" alt="Navodhayam Logo">
</p>

<h1 align="center">Navodhayam Library</h1>

<p align="center">
  <b>A premium, mobile-first PWA digital library system designed for rural empowerment.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor">
  <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" alt="Google Sheets">
</p>

---

Navodhayam Library is a professional digital library assistant. It provides an intuitive interface for users to browse books, locate them on physical shelves, and request titles seamlessly. The app is powered by **Firebase** for real-time data synchronization and secure administrative control.

## ✨ Key Features

### 👤 User Interface & Experience
- **📱 Premium PWA Experience**: Fully optimized Progressive Web App with custom glassmorphic installation prompts. Supports offline access via Service Workers.
- **🎨 Modern Design System**: Vibrant HSL-tailored color palettes, dark mode support, glassmorphism, and smooth micro-animations.
- **📷 Book Cover Scanning**: Integrated document scanner allowing users to snap, crop, and upload book covers directly from mobile devices.
- **🔍 Advanced Search & Filter**: Paginated data loading for 5,000+ books with multi-criteria search (Book ID, Member ID, Author, Title).

### 🔐 Admin & Management
- **🎙️ Malayalam Voice Alerts**: Automated audio notifications for new requests using optimized Web Speech detection.
- **📲 OS Push Notifications**: Real-time browser-level alerts even when the librarian portal is in the background.
- **🛠️ Hidden Debug Suite**: A secret 3-tap sync panel for monitoring data flow from Google Sheets and testing PWA triggers.
- **🔄 real-time Sync**: Instant Firestore synchronization ensures librarians and users are always looking at the latest data.

## 🛠️ Technical Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript (ES6 Modules), CSS3 (Custom Design System) |
| **PWA & Mobile** | Service Workers, Manifest API, **CapacitorJS** (for Native APK support) |
| **Backend & Auth** | **Firebase** (Firestore, Authentication via Google, Storage, Hosting) |
| **Icons & UI** | **Lucide Icons**, Inline SVG Symbols, Glassmorphism Backdrop Effects |
| **Data Ingestion** | **Google Apps Script** (Automated batch sync from Google Sheets) |
| **Notifications** | Browser Notification API, Web Speech API (Malayalam prioritized) |

## 🚀 Getting Started

### 1. Prerequisites
- Modern browser (Chrome/Safari recommended)
- Firebase Project setup

### 2. Quick Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/arshinmrelju/Navodaya-Library.git
   ```
2. Configure `public/js/firebase-config.js` with your Firebase credentials.
3. Deploy:
   ```bash
   firebase deploy
   ```

## 📐 Project Architecture
- **Web App**: Single Page Application (SPA) architecture with modular JS.
- **PWA**: Service Worker caching strategy for lightning-fast repeated loads and offline request visibility.
- **Data flow**: Google Sheets (Source) -> Apps Script -> Firebase Firestore (Live DB) -> Navodhayam UI.

## 🤝 Credits & Contributors
Developed by Dept. of English Interns at **Pazhassiraja College** to empower rural communities through organized knowledge access.

---
<p align="center">
  © 2026 Navodhayam. Open Source for Community Use.
</p>