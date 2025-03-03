import { db } from "../js/firebase-config.js";
import { collection,addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
function ajouterMot() {
    let swahili = document.getElementById("swahiliInput").value;
    let francais = document.getElementById("francaisInput").value;
    let etape = document.getElementById("etapeInput").value;
    let type = document.getElementById("typeInput").value;

    if (!swahili || !francais) {
        alert("Veuillez remplir au moins le mot en swahili et sa traduction en français.");
        return;
    }

    let container = document.getElementById("wordsTableBody");

    let card = document.createElement("div");
    card.classList.add("table-card");

    card.innerHTML = `
        <div class="row">
            <span contenteditable="true" onblur="modifierMot(this, 'swahili')">${swahili}</span>
            <span contenteditable="true" onblur="modifierMot(this, 'francais')">${francais}</span>
        </div>
        <div class="row">
            <span contenteditable="true" onblur="modifierMot(this, 'etape')">${etape || "-"}</span>
            <span contenteditable="true" onblur="modifierMot(this, 'type')">${type || "-"}</span>
        </div>
        <div class="actions">
            <button onclick="supprimerMot(this)">🗑 Supprimer</button>
        </div>
    `;

    container.appendChild(card);

    // Réinitialiser le formulaire
    document.getElementById("swahiliInput").value = "";
    document.getElementById("francaisInput").value = "";
    document.getElementById("etapeInput").value = "";
    document.getElementById("typeInput").value = "";
}

function supprimerMot(button) {
    let card = button.parentElement.parentElement;
    card.remove();
}

function modifierMot(element, field) {
    console.log(`Modification du champ ${field} : ${element.textContent}`);
}

function chargerMots(mots) {
    let container = document.getElementById("wordsTableBody");
    container.innerHTML = ""; // Nettoyer l'affichage avant de charger
    
    mots.forEach(mot => {
        let card = document.createElement("div");
        card.classList.add("table-card");

        card.innerHTML = `
            <div class="row">
                <span contenteditable="true" onblur="modifierMot(this, 'swahili')">${mot.swahili}</span>
                <span contenteditable="true" onblur="modifierMot(this, 'francais')">${mot.francais}</span>
            </div>
            <div class="row">
                <span contenteditable="true" onblur="modifierMot(this, 'etape')">${mot.etape || "-"}</span>
                <span contenteditable="true" onblur="modifierMot(this, 'type')">${mot.type || "-"}</span>
            </div>
            <div class="actions">
                <button onclick="supprimerMot(this)">🗑 Supprimer</button>
            </div>
        `;

        container.appendChild(card);
    });
}



// 📌 Rendre la fonction accessible globalement
window.ajouterMot = ajouterMot;
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;
