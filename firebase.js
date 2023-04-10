import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// FIREBASE PROVIDED CODE
const firebaseConfig = {
    apiKey: "AIzaSyB3Bylp6K5V_KNy0X9Hkz6nQ0fZ6X9nqBE",
    authDomain: "capstone-2874f.firebaseapp.com",
    projectId: "capstone-2874f",
    storageBucket: "capstone-2874f.appspot.com",
    messagingSenderId: "318331784812",
    appId: "1:318331784812:web:ea1bcc1503c32118c9d249",
    measurementId: "G-D2C6KX47G6"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

  let currentUser = undefined;
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });

  export {
    auth,
    db
  }