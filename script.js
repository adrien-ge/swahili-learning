
console.log("✅ script.js est bien chargé !");

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

// Initialiser Firebase et Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Vérifier si un identifiant utilisateur est déjà enregistré dans le navigateur
let userId = localStorage.getItem("user_id");

if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("user_id", userId);
}

// 📌 Fonction pour récupérer ou créer un utilisateur dans la collection "users"
async function chargerNomUtilisateur() {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let nom = "Anonyme"; // Valeur par défaut

    if (docSnap.exists()) {
        nom = docSnap.data().nom;
    } else {
        // 📌 Si l'utilisateur n'existe pas, on l'ajoute à la base
        await setDoc(docRef, { nom: "Anonyme", leçon: "Aucune", score: 0, dateInscription: new Date() });
    }

    // 📌 Vérifier que l'élément HTML existe avant d'afficher le nom
    const nomElement = document.getElementById("nomUtilisateur");
    if (nomElement) {
        nomElement.textContent = `Bienvenue, ${nom} !`;
    } else {
        console.error("L'élément #nomUtilisateur n'existe pas dans le HTML.");
    }
}

// Charger le nom de l'utilisateur au démarrage
chargerNomUtilisateur();