import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function obtenirIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Erreur IP :", error);
        return "Inconnu";
    }
}

async function identifierUtilisateur() {
    let userId = localStorage.getItem("user_id");

    if (!userId) {
        const ip = await obtenirIP();
        userId = `user_${ip.replace(/\./g, "_")}`;
        localStorage.setItem("user_id", userId);
    }

    return userId;
}

async function chargerUtilisateur() {
    const userId = await identifierUtilisateur();
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let utilisateur = { nom: "Anonyme", leçon: "Aucune", score: 0 };

    if (docSnap.exists()) {
        utilisateur = docSnap.data();
    } else {
        await setDoc(docRef, utilisateur);
    }

    document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${utilisateur.nom} !`;
}

export { chargerUtilisateur };
