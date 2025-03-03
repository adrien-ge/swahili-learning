import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
        return data.ip; // Retourne l'adresse IP
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
        return "Inconnue";
    }
}

// 📌 Fonction pour enregistrer ou charger un utilisateur avec `device_id` + `ip`
async function chargerUtilisateur() {
    const deviceId = obtenirDeviceID();
    const ip = await obtenirIP();
    const userId = `user_${deviceId}_${ip.replace(/\./g, "_")}`; // Combinaison unique de device_id et IP

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let utilisateur;

    if (docSnap.exists()) {
        // ✅ L'utilisateur existe, on charge ses données
        utilisateur = docSnap.data();
        console.log("✅ Utilisateur existant chargé :", utilisateur);
    } else {
        // 👤 L'utilisateur n'existe pas, on enregistre un nouveau
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

    // 📌 Afficher le nom de l'utilisateur sur la page
    document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${utilisateur.nom} !`;
}

export { chargerUtilisateur };
