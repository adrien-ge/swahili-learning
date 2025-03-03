import { db } from "../js/firebase-config.js";
import { collection,addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour charger les mots depuis Firebase et les afficher
async function chargerMots() {
    try {
        const wordsTableBody = document.getElementById("wordsTableBody");
        wordsTableBody.innerHTML = ""; // Réinitialiser la table

        const motsSnapshot = await getDocs(collection(db, "mots_swahili"));
        motsSnapshot.forEach((motDoc) => {
            const motData = motDoc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td contenteditable="true" onBlur="modifierMot('${motDoc.id}', 'swahili', this.textContent)">${motData.swahili}</td>
                <td contenteditable="true" onBlur="modifierMot('${motDoc.id}', 'francais', this.textContent)">${motData.francais}</td>
                <td contenteditable="true" onBlur="modifierMot('${motDoc.id}', 'etape', this.textContent)">${motData.etape || "-"}</td>
                <td contenteditable="true" onBlur="modifierMot('${motDoc.id}', 'type', this.textContent)">${motData.type || "-"}</td>
                <td>
                    <button onclick="supprimerMot('${motDoc.id}')" style="color: red;">🗑 Supprimer</button>
                </td>
            `;
            wordsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Erreur lors du chargement des mots :", error);
    }
}

// 📌 Fonction pour modifier un mot
async function modifierMot(id, champ, valeur) {
    try {
        const motRef = doc(db, "mots_swahili", id);
        await updateDoc(motRef, { [champ]: valeur });
        console.log(`✅ ${champ} mis à jour pour ${id} : ${valeur}`);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
    }
}

// 📌 Fonction pour supprimer un mot
async function supprimerMot(id) {
    if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce mot ?")) return;
    try {
        await deleteDoc(doc(db, "mots_swahili", id));
        console.log("✅ Mot supprimé :", id);
        chargerMots(); // Recharger la liste après suppression
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
    }
}

// 📌 Charger les mots au démarrage
chargerMots();


function ajouterMot() {
    let swahili = document.getElementById("swahiliInput").value;
    let francais = document.getElementById("francaisInput").value;
    let etape = document.getElementById("etapeInput").value;
    let type = document.getElementById("typeInput").value;

    let container = document.getElementById("wordsTableBody");

    let card = document.createElement("div");
    card.classList.add("table-card");

    card.innerHTML = `
        <div class="row"><span>${swahili}</span> <span>${francais}</span></div>
        <div class="row"><span>${etape}</span> <span>${type}</span></div>
        <div class="actions"><button onclick="supprimerMot(this)">Supprimer</button></div>
    `;

    container.appendChild(card);
}

// 📌 Rendre la fonction accessible globalement
window.ajouterMot = ajouterMot;

// 📌 Rendre les fonctions accessibles globalement
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;
