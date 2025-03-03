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

// 📌 Rendre la fonction accessible globalement
window.verifierMotDePasse = verifierMotDePasse;
