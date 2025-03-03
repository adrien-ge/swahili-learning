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

async function supprimerTousUtilisateurs() {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer tous les utilisateurs ? Cette action est irréversible.")) {
        return;
    }
    
    console.log("📌 Suppression des utilisateurs suivants :");
    snapshot.docs.forEach(userDoc => {
        console.log(userDoc.id, "=>", userDoc.data());
    });
    
    try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        
        console.log("📌 Suppression des utilisateurs suivants :");
        snapshot.docs.forEach(userDoc => {
            console.log(userDoc.id, "=>", userDoc.data());
        });
        
        for (const userDoc of snapshot.docs) {
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
window.afficherUtilisateurs = afficherUtilisateurs;

