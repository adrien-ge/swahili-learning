import { db } from "./firebase-config.js";
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour récupérer l'IP de l'utilisateur
async function obtenirIP() {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        return data.ip; // Retourne l'adresse IP
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP :", error);
        return "Inconnu";
    }
}

// 📌 Fonction pour rechercher un utilisateur par IP
async function rechercherUtilisateurParIP(ip) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("ip", "==", ip));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() }; // Retourne l'utilisateur existant
    } else {
        return null; // Aucun utilisateur trouvé
    }
}

// 📌 Fonction pour enregistrer ou charger l'utilisateur
async function enregistrerUtilisateur() {
    const ip = await obtenirIP(); // Récupérer l'IP
    let utilisateur = await rechercherUtilisateurParIP(ip); // Vérifier si l'IP existe déjà

    if (utilisateur) {
        console.log("✅ Utilisateur existant trouvé :", utilisateur);
    } else {
        // 📌 Nouvel utilisateur à enregistrer
        utilisateur = {
            nom: "Anonyme",
            ip: ip,
            leçon: "Aucune",
            score: 0,
            dateInscription: new Date()
        };

        const userId = `user_${ip.replace(/\./g, "_")}`;
        await setDoc(doc(db, "users", userId), utilisateur);

        console.log("👤 Nouvel utilisateur enregistré :", utilisateur);
    }

    // 📌 Afficher le nom de l'utilisateur dans la page
    document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${utilisateur.nom} !`;
}

export { enregistrerUtilisateur };
