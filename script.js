// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 📌 Fonction pour ajouter un utilisateur
async function ajouterUtilisateur(userId, nom) {
    try {
        await setDoc(doc(db, "utilisateurs", userId), {
            nom: nom,
            leçon: "Aucune",
            score: 0,
            dateInscription: new Date()
        });
        console.log("Utilisateur ajouté avec succès !");
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// 📌 Exemple d'utilisation (ajouter un utilisateur)
ajouterUtilisateur("user_ABC123", "Alice");


import { getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour charger les données d’un utilisateur
async function chargerUtilisateur(userId) {
    const docRef = doc(db, "utilisateurs", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Utilisateur trouvé :", docSnap.data());
        return docSnap.data();
    } else {
        console.log("Aucun utilisateur trouvé.");
        return null;
    }
}

// 📌 Exemple d'utilisation (charger un utilisateur)
chargerUtilisateur("user_ABC123").then(data => {
    if (data) {
        document.getElementById("progression").textContent = `Leçon : ${data.leçon}, Score : ${data.score}`;
    }
});
