import { db } from "../js/firebase-config.js";
import { collection, getDocs, setDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// 📌 Rendre les fonctions accessibles globalement
window.verifierMotDePasse = verifierMotDePasse;
window.supprimerTousUtilisateurs = supprimerTousUtilisateurs;
window.afficherUtilisateurs = afficherUtilisateurs;

// 📌 Fonction pour nettoyer les anciens utilisateurs avec IP dans l'ID
async function nettoyerUtilisateurs() {
    if (!confirm("⚠️ Es-tu sûr de vouloir nettoyer les anciens utilisateurs ? Cette action est irréversible.")) {
        return;
    }

    try {
        const usersSnapshot = await getDocs(collection(db, "users"));

        const deletePromises = [];
        const createPromises = [];

        usersSnapshot.forEach(async userDoc => {
            const userId = userDoc.id;

            // Vérifier si l'ID contient un "_"
            if (userId.includes("_")) {
                const data = userDoc.data();

                // Extraire uniquement le device_id
                const deviceId = data.device_id || userId.split("_")[1];

                if (!deviceId) {
                    console.warn(`⚠️ Aucun device_id trouvé pour l'utilisateur : ${userId}`);
                    return;
                }

                const newUserRef = doc(db, "users", deviceId);

                // Vérifie si un utilisateur avec le deviceId existe déjà pour éviter les doublons
                const newUserSnap = await getDoc(newUserRef);
                if (!newUserSnap.exists()) {
                    createPromises.push(setDoc(newUserRef, {
                        ...data,
                        dateInscription: data.dateInscription || new Date()
                    }));
                    console.log(`✅ Utilisateur recréé avec ID : ${deviceId}`);
                } else {
                    console.log(`ℹ️ L'utilisateur ${deviceId} existe déjà, pas de duplication.`);
                }

                // Supprimer l'ancien utilisateur avec IP dans l'ID
                deletePromises.push(deleteDoc(doc(db, "users", userId)));
            }
        });

        await Promise.all([...createPromises, ...deletePromises]);

        alert("✅ Nettoyage terminé !");
    } catch (error) {
        console.error("Erreur lors du nettoyage :", error);
        alert("❌ Une erreur est survenue pendant le nettoyage.");
    }
}

// 📌 Rendre la fonction accessible globalement
window.nettoyerUtilisateurs = nettoyerUtilisateurs;

