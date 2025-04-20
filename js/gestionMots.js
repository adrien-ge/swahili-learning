import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let tousLesMots = []; // Liste globale pour filtrer sans recharger Firebase
// Chargement initial des mots
async function chargerMots() {
    let container = document.getElementById("wordsTableBody");
    container.innerHTML = "";  // Nettoyer l'affichage avant de charger

    try {
        const motsQuery = query(collection(db, "mots_swahili"), orderBy("dateEnregistrement", "desc"));
        const querySnapshot = await getDocs(motsQuery);
        
        tousLesMots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        afficherMots(tousLesMots);

    } catch (error) {
        console.error("Erreur lors du chargement des mots:", error);
    }
}

// Affichage dynamique des mots (filtrés ou complets)
function afficherMots(mots) {
    let container = document.getElementById("wordsTableBody");
    container.innerHTML = "";

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
}

// Filtrage en direct dès la saisie
function filtrerMots() {
    const filtre = document.getElementById("swahiliInput").value.trim().toLowerCase();
    const motsFiltres = tousLesMots.filter(m =>
        m.swahili.toLowerCase().includes(filtre)
    );
    afficherMots(motsFiltres);
}

// Activer l'écouteur dès que la page est prête
document.addEventListener("DOMContentLoaded", () => {
    const champFiltre = document.getElementById("swahiliInput");
    if (champFiltre) {
        champFiltre.addEventListener("input", filtrerMots);
    }
});

// ✅ FIN MODIFICATION — 2025-04-19

// 🔤 Fonction de normalisation : minuscule + suppression d'accents
function normaliserTexte(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  async function ajouterMot() {
    let swahili = document.getElementById("swahiliInput").value.trim();
    let francais = document.getElementById("francaisInput").value.trim();
    let etape = document.getElementById("etapeInput").value;
    let type = document.getElementById("typeInput").value;
  
    if (!swahili || !francais) {
      alert("Veuillez remplir au moins le mot en swahili et sa traduction en français.");
      return;
    }
  
    const swahiliNormalise = normaliserTexte(swahili);
  
    try {
      const motsRef = collection(db, "mots_swahili");
      const q = query(motsRef, where("swahiliNormalise", "==", swahiliNormalise));
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        alert("Ce mot existe déjà (même s'il est écrit avec une majuscule ou accent).");
        return;
      }
  
      await addDoc(motsRef, {
        swahili,
        swahiliNormalise,
        francais,
        etape: etape || "",
        type: type || "",
        dateEnregistrement: Timestamp.now()
      });
  
      chargerMots();
    } catch (error) {
      console.error("Erreur lors de l'ajout du mot:", error);
      alert("Erreur lors de l'enregistrement.");
    }
  
    document.getElementById("swahiliInput").value = "";
    document.getElementById("francaisInput").value = "";
    document.getElementById("etapeInput").value = "";
    document.getElementById("typeInput").value = "";
  }

async function ajouterMot2() {
    let swahili = document.getElementById("swahiliInput").value;
    let francais = document.getElementById("francaisInput").value;
    let etape = document.getElementById("etapeInput").value;
    let type = document.getElementById("typeInput").value;

    if (!swahili || !francais) {
        alert("Veuillez remplir au moins le mot en swahili et sa traduction en français.");
        return;
    }

    const timestamp = new Date();  // Créer un objet Date pour le timestamp actuel

    try {
        await addDoc(collection(db, "mots_swahili"), {
            swahili,
            francais,
            etape: etape || "",
            type: type || "",
            dateEnregistrement: timestamp  // Enregistrer le timestamp
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
        const updateData = {
            [field]: newValue,
            dateEnregistrement: new Date()  // Enregistrer la date actuelle de la modification
        };
        await updateDoc(motRef, updateData);
        console.log(`Modification du champ ${field} : ${newValue}`);
        console.log(`Date de modification mise à jour pour le mot ${id}`);
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
    const types = ["verbe", "nom", "adjectif", "expression", "autre"]; // Exemple de types
    return types.map(type => 
        `<option value="${type}" ${type === typeActuel ? "selected" : ""}>${type}</option>`
    ).join('');
}

// Charger les mots au démarrage
document.addEventListener("DOMContentLoaded", chargerMots);

// Rendre les fonctions accessibles globalement
window.ajouterMot = ajouterMot;
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;
