import { db } from "../js/firebase-config.js";
import { collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour charger et insérer les mots depuis un fichier JSON
async function insererMotsDepuisJSON() {
    try {
        const response = await fetch("../data/mots.json"); // 📌 Assurez-vous que le fichier est bien placé
        const mots = await response.json();

        const motsCollection = collection(db, "mots_swahili");

        for (const mot of mots) {
            const motRef = doc(motsCollection);
            await setDoc(motRef, mot);
            console.log(`✅ Ajouté : ${mot.swahili} -> ${mot.francais}`);
        }

        alert("✅ Insertion terminée avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout des mots :", error);
    }
}

// 📌 Exécuter l'importation des mots
insererMotsDepuisJSON();
