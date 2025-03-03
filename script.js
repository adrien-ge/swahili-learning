
console.log("✅ script.js est bien chargé !");

// 📌 Vérifier si un identifiant utilisateur est déjà enregistré dans le navigateur
let userId = localStorage.getItem("user_id");

if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("user_id", userId);
}

// 📌 Fonction pour récupérer ou créer un utilisateur dans la collection "users"
async function chargerNomUtilisateur() {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    let nom = "Anonyme"; // Valeur par défaut

    if (docSnap.exists()) {
        nom = docSnap.data().nom;
    } else {
        // 📌 Si l'utilisateur n'existe pas, on l'ajoute à la base
        await setDoc(docRef, { nom: "Anonyme", leçon: "Aucune", score: 0, dateInscription: new Date() });
    }

    // 📌 Vérifier que l'élément HTML existe avant d'afficher le nom
    const nomElement = document.getElementById("nomUtilisateur");
    if (nomElement) {
        nomElement.textContent = `Bienvenue, ${nom} !`;
    } else {
        console.error("L'élément #nomUtilisateur n'existe pas dans le HTML.");
    }
}

// Charger le nom de l'utilisateur au démarrage
chargerNomUtilisateur();