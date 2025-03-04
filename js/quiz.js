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

function chargerNouveauMot() {
    if (mots.length === 0) {
        document.getElementById("swahiliWord").textContent = "Aucun mot disponible";
        return;
    }
    
    // Sélectionner un mot au hasard
    motActuel = mots[Math.floor(Math.random() * mots.length)];
    document.getElementById("swahiliWord").textContent = motActuel.swahili;
    
    // Filtrer les mots pour obtenir ceux du même type que le mot actuel, excluant le mot actuel lui-même
    let candidatsMauvaisesReponses = mots.filter(m => m.type === motActuel.type && m.id !== motActuel.id);
    
    // Si pas assez de candidats du même type, prendre d'autres au hasard pour compléter
    if (candidatsMauvaisesReponses.length < 2) {
        let autresMauvaisesReponses = mots.filter(m => m.id !== motActuel.id && !candidatsMauvaisesReponses.includes(m));
        candidatsMauvaisesReponses = candidatsMauvaisesReponses.concat(autresMauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2 - candidatsMauvaisesReponses.length));
    }

    // Sélectionner 2 mauvaises réponses au hasard parmi les candidats
    let mauvaisesReponses = candidatsMauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    // Mélanger les réponses et les afficher
    let reponses = [motActuel, ...mauvaisesReponses].sort(() => 0.5 - Math.random());
    document.querySelectorAll(".quiz-btn").forEach((btn, index) => {
        btn.textContent = reponses[index].francais;
        btn.dataset.correct = reponses[index].id === motActuel.id;
    });
}

async function verifierReponse(index) {
    const boutons = document.querySelectorAll(".quiz-btn");
    const message = document.getElementById("message");

    let correct = boutons[index].dataset.correct === "true";

    if (correct) {
        message.textContent = "✅ Bonne réponse !";
        message.style.color = "green";
    } else {
        message.textContent = "❌ Mauvaise réponse, essayez encore.";
        message.style.color = "red";
    }


    // Charger un nouveau mot pour la prochaine question
    setTimeout(() => {
        message.textContent = "";
        chargerNouveauMot();
    }, 1000);
}


// Charger les mots au démarrage
chargerMots();

// 📌 Rendre la fonction globale
window.verifierReponse = verifierReponse;
