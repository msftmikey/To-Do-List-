// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYpvMKZiXfi3CdTPUKHMwM9mVHNCJnX44",
  authDomain: "planner-a78ec.firebaseapp.com",
  projectId: "planner-a78ec",
  storageBucket: "planner-a78ec.appspot.com",
  messagingSenderId: "1049673576302",
  appId: "1:1049673576302:web:27f5d0f9ffa3e606f79b7f",
  measurementId: "G-QLGE7MT6QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);