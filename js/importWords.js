import { db } from "../js/firebase-config.js";
import { collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 📌 Fonction pour supprimer tous les mots avant importation
async function supprimerTousLesMots() {
    try {
        const motsSnapshot = await getDocs(collection(db, "mots_swahili"));
        
        console.log("📌 Suppression des mots existants...");
        const deletePromises = motsSnapshot.docs.map(motDoc => deleteDoc(doc(db, "mots_swahili", motDoc.id)));
        await Promise.all(deletePromises);
        
        console.log("✅ Tous les mots ont été supprimés avec succès.");
    } catch (error) {
        console.error("❌ Erreur lors de la suppression des mots :", error);
    }
}

// 📌 Fonction pour charger et insérer tous les fichiers JSON après suppression
async function insererTousLesMotsDepuisJSON() {
    try {
        await supprimerTousLesMots(); // Supprime tous les mots avant d'importer

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