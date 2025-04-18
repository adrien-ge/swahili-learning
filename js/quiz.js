
import { db } from "../js/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let mots = [];
let motActuel = {};
let modeInverse = false; // false = Swahili -> Français, true = Français -> Swahili

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

    motActuel = mots[Math.floor(Math.random() * mots.length)];
    const questionEl = document.getElementById("swahiliWord");
    const titleEl = document.getElementById("quizTitle");

    if (modeInverse) {
        questionEl.textContent = motActuel.francais;
        if (titleEl) titleEl.textContent = "Quel est le mot en Swahili ?";
    } else {
        questionEl.textContent = motActuel.swahili;
        if (titleEl) titleEl.textContent = "Quel est le mot en Francais ?";
    }

    let candidatsMauvaisesReponses = mots.filter(m => m.type === motActuel.type && m.id !== motActuel.id);
    if (candidatsMauvaisesReponses.length < 2) {
        let autresMauvaisesReponses = mots.filter(m => m.id !== motActuel.id && !candidatsMauvaisesReponses.includes(m));
        candidatsMauvaisesReponses = candidatsMauvaisesReponses.concat(autresMauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2 - candidatsMauvaisesReponses.length));
    }

    let mauvaisesReponses = candidatsMauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2);

    let reponses = [motActuel, ...mauvaisesReponses].sort(() => 0.5 - Math.random());
    document.querySelectorAll(".quiz-btn").forEach((btn, index) => {
        btn.textContent = modeInverse ? reponses[index].swahili : reponses[index].francais;
        btn.dataset.correct = reponses[index].id === motActuel.id;

        // Réinitialise styles et active les boutons
        btn.classList.remove("bounce");
        btn.disabled = false;
        btn.blur();
    });
}

async function verifierReponse(index) {
    const boutons = document.querySelectorAll(".quiz-btn");
    const message = document.getElementById("message");

    const boutonClique = boutons[index];
    boutonClique.blur();

    let correct = boutonClique.dataset.correct === "true";

    // Supprime tous les styles de hover/focus bloqués et désactive les autres boutons
    boutons.forEach(btn => {
        btn.blur();
        btn.disabled = true;
    });

    if (correct) {
        message.textContent = "✅ Bonne réponse !";
        message.style.color = "green";

        // Ajoute l'effet bounce
        boutonClique.classList.add("bounce");

        setTimeout(() => {
            boutonClique.classList.remove("bounce");
            message.textContent = "";
            chargerNouveauMot();
        }, 1000);
    } else {
        message.textContent = "❌ Mauvaise réponse, essayez encore.";
        message.style.color = "red";
    }
}

function basculerMode() {
    modeInverse = !modeInverse;
    const bouton = document.getElementById("toggleModeBtn");
    if (bouton) bouton.textContent = modeInverse ? "🔄 Inverser (Francais - Swahili)" : "🔄 Inverser (Swahili - Francais)";
    chargerNouveauMot();
}

document.getElementById("toggleModeBtn")?.addEventListener("click", basculerMode);

// 📌 Initialisation
chargerMots();
window.verifierReponse = verifierReponse;
