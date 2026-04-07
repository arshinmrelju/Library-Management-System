// Firebase Configuration for Nayodayam Library
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    enableMultiTabIndexedDbPersistence 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHVoMliBWV_zikCnievv7T1igbtQRXD2s",
    authDomain: "navodaymlibrary.firebaseapp.com",
    projectId: "navodaymlibrary",
    storageBucket: "navodaymlibrary.firebasestorage.app",
    messagingSenderId: "1015676164901",
    appId: "1:1015676164901:web:9c24f1812443d882da18cc",
    measurementId: "G-92C8DYG7H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable Offline Persistence for much faster loads and lower quota usage
enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a a time.
        console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence is not supported by this browser');
    }
});

const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, analytics, googleProvider };
