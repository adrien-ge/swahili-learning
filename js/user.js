// user.js

import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// 📌 Fonction pour récupérer ou générer un `device_id`
function obtenirDeviceID() {
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = crypto.randomUUID(); // Génère un identifiant unique
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
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
    await obtenirIP(); // Optionnellement tu peux utiliser l'IP si tu veux plus tard
    const userId = `${deviceId}`; // Juste deviceId

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let utilisateur;

    if (docSnap.exists()) {
        utilisateur = docSnap.data();
        console.log("✅ Utilisateur existant chargé :", utilisateur);
    } else {
        utilisateur = {
            nom: "",
            device_id: deviceId,
            leçon: "Aucune",
            score: 0,
            dateInscription: new Date()
        };

        await setDoc(docRef, utilisateur);
        console.log("👤 Nouvel utilisateur enregistré :", utilisateur);
    }

    // 📌 Met à jour le nom dans le header de la page
    const nomElement = document.getElementById("nomUtilisateur");
    if (nomElement) {
        nomElement.textContent = `Bienvenue, ${utilisateur.nom} !`;
    } else {
        console.warn("⚠️ L'élément #nomUtilisateur est introuvable dans la page.");
    }
}


// 📌 Fonction pour récupérer l'IP de l'utilisateur
async function obtenirIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        localStorage.setItem("last_ip", data.ip); // pour réutiliser plus tard
        return data.ip;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
        return "Inconnue";
    }
}

// 📌 Gestion du formulaire prénom
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPrenom");
    const input = document.getElementById("inputPrenom");
    const modifierBtn = document.getElementById("modifierPrenomBtn");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const prenom = input.value.trim();
            if (!prenom) return;

            const deviceId = localStorage.getItem("device_id");
            const ip = localStorage.getItem("last_ip");
            const userId = `user_${deviceId} || "Inconnue"}`;

            const userRef = doc(db, "users", userId);

            try {
                await updateDoc(userRef, { nom: prenom });
                document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${prenom} !`;
                input.value = "";
                form.style.display = "none";
                if (modifierBtn) modifierBtn.style.display = "inline-block";
            } catch (error) {
                console.error("Erreur lors de la mise à jour du prénom :", error);
            }
        });
    }

    // 📌 Réafficher le formulaire si on clique sur le bouton "Modifier"
    if (modifierBtn) {
        modifierBtn.addEventListener("click", () => {
            form.style.display = "block";
            modifierBtn.style.display = "none";
        });
    }
});

export { chargerUtilisateur };
