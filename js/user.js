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

// 📌 Fonction pour enregistrer ou charger un utilisateur
async function chargerUtilisateur() {
    const deviceId = obtenirDeviceID();
    const docRef = doc(db, "users", deviceId);
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
            ip: "Inconnue",
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
