
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
    const container = document.getElementById("optionsContainer");

    if (modeInverse) {
        questionEl.textContent = motActuel.francais;
        if (titleEl) titleEl.textContent = "Quel est le mot en Swahili ?";
    } else {
        questionEl.textContent = motActuel.swahili;
        if (titleEl) titleEl.textContent = "Quel est le mot en Francais ?";
    }

    let candidatsMauvaisesReponses = mots.filter(m => m.type === motActuel.type && m.id !== motActuel.id);
    if (candidatsMauvaisesReponses.length < 2) {
        let autres = mots.filter(m => m.id !== motActuel.id && !candidatsMauvaisesReponses.includes(m));
        candidatsMauvaisesReponses = candidatsMauvaisesReponses.concat(autres.sort(() => 0.5 - Math.random()).slice(0, 2 - candidatsMauvaisesReponses.length));
    }

    let mauvaises = candidatsMauvaisesReponses.sort(() => 0.5 - Math.random()).slice(0, 2);
    let reponses = [motActuel, ...mauvaises].sort(() => 0.5 - Math.random());

    // 🔁 Supprime et recrée les boutons à chaque question (anti-hover iOS)
    container.innerHTML = "";

    reponses.forEach(rep => {
        const btn = document.createElement("button");
        btn.className = "quiz-btn option-btn";
        btn.textContent = modeInverse ? rep.swahili : rep.francais;
        btn.dataset.correct = rep.id === motActuel.id;
        btn.onclick = () => verifierReponse(rep.id === motActuel.id, btn);
        container.appendChild(btn);
    });
}

function verifierReponse(correct, boutonClique) {
    const message = document.getElementById("message");

    // 🔧 iPhone fix : force redraw
    boutonClique.blur();
    boutonClique.style.display = 'none';
    void boutonClique.offsetHeight;
    boutonClique.style.display = '';

    if (correct) {
        message.textContent = "✅ Bonne réponse !";
        message.style.color = "green";

        boutonClique.classList.add("bounce");

        setTimeout(() => {
            boutonClique.classList.remove("bounce");
            message.textContent = "";
            chargerNouveauMot();
        }, 1000);
    } else {
        message.textContent = "❌ Mauvaise réponse, essayez encore.";
        message.style.color = "red";

        boutonClique.disabled = true;
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
