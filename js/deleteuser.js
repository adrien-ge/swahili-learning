import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// 📌 Fonction pour supprimer un utilisateur
async function supprimerUtilisateur() {
    const userId = document.getElementById("userId").value.trim();
    const message = document.getElementById("message");

    if (!userId) {
        message.textContent = "❌ Veuillez entrer un ID utilisateur valide.";
        message.style.color = "red";
        return;
    }

    try {
        await deleteDoc(doc(db, "users", userId));
        message.textContent = "✅ Utilisateur supprimé avec succès.";
        message.style.color = "green";
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        message.textContent = "❌ Erreur lors de la suppression. Vérifiez l'ID.";
        message.style.color = "red";
    }
}

// 📌 Fonction pour supprimer tous les utilisateurs
async function supprimerTousUtilisateurs() {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer tous les utilisateurs ? Cette action est irréversible.")) {
        return;
    }
    
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        
        snapshot.forEach(async (userDoc) => {
            await deleteDoc(doc(db, "users", userDoc.id));
        });
        
        alert("✅ Tous les utilisateurs ont été supprimés avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression de tous les utilisateurs :", error);
        alert("❌ Une erreur est survenue. Vérifiez votre connexion à Firebase.");
    }
}

// 📌 Rendre les fonctions accessibles globalement
window.verifierMotDePasse = verifierMotDePasse;
window.supprimerTousUtilisateurs = supprimerTousUtilisateurs;
window.supprimerUtilisateur = supprimerUtilisateur;
