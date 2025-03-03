import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function verifierReponse(userId, reponse) {
    const resultat = document.getElementById("resultat");

    if (reponse === "A") {
        resultat.textContent = "✅ Correct !";
        resultat.style.color = "green";

        // Ajouter des points
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        let utilisateur = docSnap.exists() ? docSnap.data() : { score: 0 };

        utilisateur.score += 10;
        await setDoc(docRef, utilisateur);
    } else {
        resultat.textContent = "❌ Mauvaise réponse.";
        resultat.style.color = "red";
    }
}

export { verifierReponse };
