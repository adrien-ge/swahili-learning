import { db } from "../js/firebase-config.js";
import { collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour charger et insérer les mots depuis un fichier JSON
// 📌 Fonction pour charger et insérer tous les fichiers JSON du dossier /data/
async function insererTousLesMotsDepuisJSON() {
    try {
        const fichiers = ["mots1.json", "mots2.json", "mots3.json"]; // 📌 Ajoutez vos fichiers ici

        for (const fichier of fichiers) {
            const response = await fetch(`../data/${fichier}`);
            if (!response.ok) {
                console.warn(`⚠️ Impossible de charger ${fichier}`);
                continue;
            }
            const mots = await response.json();
            
            const motsCollection = collection(db, "mots_swahili");
            for (const mot of mots) {
                const motRef = doc(motsCollection);
                await setDoc(motRef, mot);
                console.log(`✅ Ajouté depuis ${fichier} : ${mot.swahili} -> ${mot.francais}`);
            }
        }

        alert("✅ Importation de tous les fichiers JSON réussie !");
    } catch (error) {
        console.error("❌ Erreur lors de l'importation des fichiers JSON :", error);
    }
}

window.insererTousLesMotsDepuisJSON = insererTousLesMotsDepuisJSON;