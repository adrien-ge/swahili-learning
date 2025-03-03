// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrwlHG_McdB_9Ix1jV4xE1FOXF4Za1HnU",
  authDomain: "swahili-learning.firebaseapp.com",
  databaseURL: "https://swahili-learning-default-rtdb.firebaseio.com",
  projectId: "swahili-learning",
  storageBucket: "swahili-learning.firebasestorage.app",
  messagingSenderId: "951029308175",
  appId: "1:951029308175:web:75c07ae1e94a81034f7c7a",
  measurementId: "G-QVQFHXS401"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
