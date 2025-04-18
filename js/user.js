// user.js

import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// 📌 Fonction pour récupérer ou générer un `device_id`
function obtenirDeviceID() {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

// 📌 Fonction pour obtenir l’adresse IP
async function obtenirIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Erreur lors de l'obtention de l'IP :", error);
        return "inconnue";
    }
}

// 📌 Connexion anonyme à Firebase
signInAnonymously(auth)
    .then(() => {
        console.log("✅ Connecté anonymement à Firebase");
        chargerUtilisateur();
    })
    .catch((error) => {
        console.error("❌ Erreur de connexion anonyme :", error);
    });

// 📌 Charger ou créer l'utilisateur dans Firestore
async function chargerUtilisateur() {
    const deviceId = obtenirDeviceID();
    const ip = await obtenirIP();
    const ref = doc(db, "utilisateurs", `${deviceId}_${ip}`);
    const docSnap = await getDoc(ref);

    let utilisateur = {};

    if (docSnap.exists()) {
        utilisateur = docSnap.data();
        console.log("👤 Utilisateur trouvé :", utilisateur);

        // Affiche le prénom dans les balises avec .prenom
        document.querySelectorAll(".prenom").forEach(el => {
            el.textContent = utilisateur.nom || "";
        });

    } else {
        console.log("👤 Nouvel utilisateur, création...");
        await setDoc(ref, { nom: "" });
    }

    // 🎯 Affiche ou masque le formulaire selon que le prénom existe
    const form = document.getElementById("formPrenom");
    const modifierBtn = document.getElementById("modifierPrenomBtn");

    if (utilisateur.nom && form && modifierBtn) {
        form.style.display = "none";         // Masque le formulaire
        modifierBtn.style.display = "block"; // Affiche le bouton de modification
    } else if (form && modifierBtn) {
        form.style.display = "block";        // Affiche le formulaire
        modifierBtn.style.display = "none";  // Cache le bouton
    }
}

// 📌 Mise à jour du prénom
document.getElementById("formPrenom")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prenom = document.getElementById("prenom").value.trim();
    if (!prenom) return;

    const deviceId = obtenirDeviceID();
    const ip = await obtenirIP();
    const ref = doc(db, "utilisateurs", `${deviceId}_${ip}`);

    await updateDoc(ref, { nom: prenom });
    document.querySelectorAll(".prenom").forEach(el => {
        el.textContent = prenom;
    });

    // Met à jour l'affichage
    document.getElementById("formPrenom").style.display = "none";
    document.getElementById("modifierPrenomBtn").style.display = "block";
});

// 📌 Afficher à nouveau le formulaire quand on clique sur "Modifier le prénom"
document.getElementById("modifierPrenomBtn")?.addEventListener("click", () => {
    document.getElementById("formPrenom").style.display = "block";
    document.getElementById("modifierPrenomBtn").style.display = "none";
});


export { chargerUtilisateur };
