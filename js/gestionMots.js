import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function chargerMots() {
    let container = document.getElementById("wordsTableBody");
    container.innerHTML = ""; // Nettoyer l'affichage avant de charger
    
    try {
        const motsSnapshot = await getDocs(collection(db, "mots_swahili")); // Correction du nom de la collection
        let mots = [];
        motsSnapshot.forEach(doc => {
            mots.push({ id: doc.id, ...doc.data() });
        });

        mots.forEach(mot => {
            let card = document.createElement("div");
            card.classList.add("table-card");

            card.innerHTML = `
                <div class="row">
                    <span contenteditable="true" onblur="modifierMot('${mot.id}', 'swahili', this.textContent)">${mot.swahili}</span>
                    <span contenteditable="true" onblur="modifierMot('${mot.id}', 'francais', this.textContent)">${mot.francais}</span>
                </div>
                <div class="row">
                    <span contenteditable="true" onblur="modifierMot('${mot.id}', 'etape', this.textContent)">${mot.etape || "-"}</span>
                    <span contenteditable="true" onblur="modifierMot('${mot.id}', 'type', this.textContent)">${mot.type || "-"}</span>
                </div>
                <div class="actions">
                    <button onclick="supprimerMot('${mot.id}')">🗑 Supprimer</button>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des mots:", error);
    }
}

async function ajouterMot() {
    let swahili = document.getElementById("swahiliInput").value;
    let francais = document.getElementById("francaisInput").value;
    let etape = document.getElementById("etapeInput").value;
    let type = document.getElementById("typeInput").value;

    if (!swahili || !francais) {
        alert("Veuillez remplir au moins le mot en swahili et sa traduction en français.");
        return;
    }

    try {
        await addDoc(collection(db, "mots_swahili"), { // Correction du nom de la collection
            swahili,
            francais,
            etape: etape || "",
            type: type || ""
        });
        chargerMots();
    } catch (error) {
        console.error("Erreur lors de l'ajout du mot:", error);
    }

    // Réinitialiser le formulaire
    document.getElementById("swahiliInput").value = "";
    document.getElementById("francaisInput").value = "";
    document.getElementById("etapeInput").value = "";
    document.getElementById("typeInput").value = "";
}

async function modifierMot(id, field, newValue) {
    try {
        const motRef = doc(db, "mots_swahili", id); // Correction du nom de la collection
        await updateDoc(motRef, { [field]: newValue });
        console.log(`Modification du champ ${field} : ${newValue}`);
    } catch (error) {
        console.error("Erreur lors de la modification du mot:", error);
    }
}

async function supprimerMot(id) {
    try {
        await deleteDoc(doc(db, "mots_swahili", id)); // Correction du nom de la collection
        chargerMots();
    } catch (error) {
        console.error("Erreur lors de la suppression du mot:", error);
    }
}

// 📌 Charger les mots au démarrage
document.addEventListener("DOMContentLoaded", chargerMots);

// 📌 Rendre les fonctions accessibles globalement
window.ajouterMot = ajouterMot;
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;
