// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_KEY,
  authDomain: "pet-adoption-69cf2.firebaseapp.com",
  projectId: "pet-adoption-69cf2",
  storageBucket: "pet-adoption-69cf2.firebasestorage.app",
  messagingSenderId: "75486960480",
  appId: "1:75486960480:web:383c4fde76d2a26f945c05",
  measurementId: "G-VR32PQQWEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

//const analytics = getAnalytics(app);