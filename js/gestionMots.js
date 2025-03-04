import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function chargerMots() {
    let container = document.getElementById("wordsTableBody");
    container.innerHTML = "";  // Nettoyer l'affichage avant de charger

    try {
        const querySnapshot = await getDocs(collection(db, "mots_swahili"));  // Pas de tri pour éviter les erreurs
        let mots = [];
        querySnapshot.forEach(doc => {
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
                    <input type="number" value="${mot.etape || 0}" onchange="modifierMot('${mot.id}', 'etape', this.value)">
                    <select onchange="modifierMot('${mot.id}', 'type', this.value)">
                        ${obtenirOptionsType(mot.type)}
                    </select>
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
        await addDoc(collection(db, "mots_swahili"), {
            swahili,
            francais,
            etape: etape || "",
            type: type || ""
        });
        chargerMots();
    } catch (error) {
        console.error("Erreur lors de l'ajout du mot:", error);
    }

    document.getElementById("swahiliInput").value = "";
    document.getElementById("francaisInput").value = "";
    document.getElementById("etapeInput").value = "";
    document.getElementById("typeInput").value = "";
}

async function modifierMot(id, field, newValue) {
    try {
        const motRef = doc(db, "mots_swahili", id);
        await updateDoc(motRef, { [field]: newValue });
        console.log(`Modification du champ ${field} : ${newValue}`);
    } catch (error) {
        console.error("Erreur lors de la modification du mot:", error);
    }
}

async function supprimerMot(id) {
    try {
        await deleteDoc(doc(db, "mots_swahili", id));
        chargerMots();
    } catch (error) {
        console.error("Erreur lors de la suppression du mot:", error);
    }
}

function obtenirOptionsType(typeActuel) {
    const types = ["verbe", "nom", "adjectif", "autre"]; // Exemple de types
    return types.map(type => 
        `<option value="${type}" ${type === typeActuel ? "selected" : ""}>${type}</option>`
    ).join('');
}

// Charger les mots au démarrage
document.addEventListener("DOMContentLoaded", chargerMots);

document.getElementById("initializeDatesBtn").addEventListener("click", async function() {
    const querySnapshot = await getDocs(collection(db, "mots_swahili"));
    let count = 0;
    querySnapshot.forEach(async (docSnapshot) => {
        if (!docSnapshot.data().dateEnregistrement) {  // Vérifier si le champ dateEnregistrement existe
            const docRef = doc(db, "mots_swahili", docSnapshot.id);
            const updateTimestamp = new Date();  // Utiliser la date actuelle
            await updateDoc(docRef, {
                dateEnregistrement: updateTimestamp
            });
            console.log(`Date ajoutée à ${docSnapshot.id}`);
            count++;
        }
    });
    console.log(`Total de ${count} documents mis à jour avec des dates d'enregistrement.`);
});

// Rendre les fonctions accessibles globalement
window.ajouterMot = ajouterMot;
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;
