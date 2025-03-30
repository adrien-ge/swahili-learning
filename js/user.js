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

// 📌 Connexion anonyme à Firebase
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Connecté anonymement à Firebase");
    chargerUtilisateur();
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion anonyme :", error);
  });

// 📌 Charger ou créer l'utilisateur
async function chargerUtilisateur() {
    const deviceId = obtenirDeviceID();
    const ip = await obtenirIP();
    const userId = `user_${deviceId}_${ip.replace(/\./g, "_")}`;

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let utilisateur;

    if (docSnap.exists()) {
        utilisateur = docSnap.data();
        console.log("✅ Utilisateur existant chargé :", utilisateur);
    } else {
        utilisateur = {
            nom: "Anonyme",
            device_id: deviceId,
            ip: ip,
            leçon: "Aucune",
            score: 0,
            dateInscription: new Date()
        };
        await setDoc(docRef, utilisateur);
        console.log("👤 Nouvel utilisateur enregistré :", utilisateur);
    }

    const nomElement = document.getElementById("nomUtilisateur");
    if (nomElement) {
        nomElement.textContent = `Bienvenue, ${utilisateur.nom} !`;
    }
}

// 📌 Mise à jour du prénom
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPrenom");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prenom = document.getElementById("inputPrenom").value.trim();
        if (!prenom) return;

        const deviceId = localStorage.getItem("device_id");
        const ip = localStorage.getItem("last_ip");
        const userId = `user_${deviceId}_${ip?.replace(/\./g, "_") || "Inconnue"}`;

        const userRef = doc(db, "users", userId);

        try {
            await updateDoc(userRef, { nom: prenom });
            document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${prenom} !`;
            document.getElementById("inputPrenom").value = "";
        } catch (error) {
            console.error("Erreur lors de la mise à jour du prénom :", error);
        }
    });
});

export { chargerUtilisateur };
