import { db } from "./firebase-config.js";

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

// 📌 Fonction pour supprimer tous les utilisateurs
async function supprimerTousUtilisateurs() {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer tous les utilisateurs ? Cette action est irréversible.")) {
        return;
    }
    
    try {
        const usersCollection = await getDocs(collection(db, "users"));
        
        for (const userDoc of usersCollection.docs) {
            await deleteDoc(doc(db, "users", userDoc.id));
        }
        
        alert("✅ Tous les utilisateurs ont été supprimés avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression de tous les utilisateurs :", error);
        alert("❌ Une erreur est survenue. Vérifiez votre connexion à Firebase.");
    }
}

// 📌 Rendre les fonctions accessibles globalement
window.verifierMotDePasse = verifierMotDePasse;
window.supprimerTousUtilisateurs = supprimerTousUtilisateurs;

