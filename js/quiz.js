import { db } from "../js/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let mots = [];
let motActuel = {};

// 📌 Fonction pour récupérer les mots en Swahili depuis Firebase
async function chargerMots() {
    try {
        const motsSnapshot = await getDocs(collection(db, "mots_swahili"));
        mots = motsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        chargerNouveauMot();
    } catch (error) {
        console.error("Erreur lors du chargement des mots :", error);
    }
}

// 📌 Fonction pour charger un nouveau mot avec 3 options
function chargerNouveauMot() {
    if (mots.length === 0) {
        document.getElementById("swahiliWord").textContent = "Aucun mot disponible";
        return;
    }
    
    // Sélectionner un mot au hasard
    motActuel = mots[Math.floor(Math.random() * mots.length)];
    document.getElementById("swahiliWord").textContent = motActuel.swahili;
    
    // Sélectionner 2 mauvaises réponses au hasard
    let mauvaisesReponses = mots.filter(m => m.id !== motActuel.id);
    mauvaisesReponses = mauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    // Mélanger les réponses et les afficher
    let reponses = [motActuel, ...mauvaisesReponses].sort(() => 0.5 - Math.random());
    document.querySelectorAll(".quiz-btn").forEach((btn, index) => {
        btn.textContent = reponses[index].francais;
        btn.dataset.correct = reponses[index].id === motActuel.id;
    });
}

// 📌 Fonction pour vérifier la réponse
function verifierReponse(index) {
    const boutons = document.querySelectorAll(".quiz-btn");
    const message = document.getElementById("message");
    
    if (boutons[index].dataset.correct === "true") {
        message.textContent = "✅ Bonne réponse !";
        message.style.color = "green";
        setTimeout(() => {
            message.textContent = "";
            chargerNouveauMot();
        }, 1000);
    } else {
        message.textContent = "❌ Mauvaise réponse, essayez encore.";
        message.style.color = "red";
    }
}

// Charger les mots au démarrage
chargerMots();

// 📌 Rendre la fonction globale
window.verifierReponse = verifierReponse;
