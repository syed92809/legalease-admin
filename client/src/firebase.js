// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcwuAtZU7a2CGUtpCJ0irygH-6WbbkQKE",
  authDomain: "lawyerfinder-86944.firebaseapp.com",
  projectId: "lawyerfinder-86944",
  storageBucket: "lawyerfinder-86944.appspot.com",
  messagingSenderId: "993201967509",
  appId: "1:993201967509:web:2a12e679acfc2ae091269c",
  measurementId: "G-BV9TZ9XEPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);       // Initialize Firestore
const storage = getStorage(app);    // Initialize Firebase Storage
const auth = getAuth(app);          // Initialize Firebase Authentication

export { app, analytics, db, storage, auth };
