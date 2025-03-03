import { db } from "../js/firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Mot de passe administrateur (à modifier selon tes besoins)
const ADMIN_PASSWORD = "123";

// 📌 Fonction pour vérifier le mot de passe
function verifierMotDePasse() {
    const passwordInput = document.getElementById("password").value;
    const message = document.getElementById("message");
    const adminContent = document.getElementById("admin-content");

    if (passwordInput === ADMIN_PASSWORD) {
        message.textContent = "✅ Accès autorisé !";
        message.style.color = "green";
        adminContent.style.display = "block"; // Afficher le contenu admin
    } else {
        message.textContent = "❌ Mot de passe incorrect !";
        message.style.color = "red";
        adminContent.style.display = "none"; // Cacher le contenu admin
    }
}

// 📌 Fonction pour afficher les utilisateurs dans la console
async function afficherUtilisateurs() {
    try {
        const usersCollection = await getDocs(collection(db, "users"));
        console.log("📌 Liste des utilisateurs :");
        usersCollection.docs.forEach(userDoc => {
            console.log(userDoc.id, "=>", userDoc.data());
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
}

// 📌 Fonction pour supprimer tous les utilisateurs
async function supprimerTousUtilisateurs() {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer tous les utilisateurs ? Cette action est irréversible.")) {
        return;
    }
    
    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        
        console.log("📌 Suppression des utilisateurs suivants :");
        usersSnapshot.docs.forEach(userDoc => {
            console.log(userDoc.id, "=>", userDoc.data());
        });
        
        const deletePromises = usersSnapshot.docs.map(userDoc => deleteDoc(doc(db, "users", userDoc.id)));
        await Promise.all(deletePromises);
        
        alert("✅ Tous les utilisateurs ont été supprimés avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression de tous les utilisateurs :", error);
        alert("❌ Une erreur est survenue. Vérifiez votre connexion à Firebase.");
    }
}


// 📌 Fonction pour charger les mots depuis un fichier JSON et les insérer dans Firebase
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

        alert("✅ Importation des mots réussie !");
    } catch (error) {
        console.error("❌ Erreur lors de l'importation des mots :", error);
    }
}

// 📌 Rendre les fonctions accessibles globalement
window.verifierMotDePasse = verifierMotDePasse;
window.supprimerTousUtilisateurs = supprimerTousUtilisateurs;
window.afficherUtilisateurs = afficherUtilisateurs;
window.insererMotsDepuisJSON = insererMotsDepuisJSON;

