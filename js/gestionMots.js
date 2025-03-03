import { db } from "../js/firebase-config.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 📌 Fonction pour charger les mots depuis Firebase et les afficher
async function chargerMots(filtre = "") {
    try {
        const wordsTableBody = document.getElementById("wordsTableBody");
        wordsTableBody.innerHTML = "";
        const motsSnapshot = await getDocs(collection(db, "mots_swahili"));
        
        motsSnapshot.forEach((motDoc) => {
            const motData = motDoc.data();
            if (filtre && !motData.type.includes(filtre) && !motData.etape.includes(filtre)) return;
            
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

// 📌 Fonction pour ajouter un nouveau mot
async function ajouterMot() {
    const swahili = document.getElementById("swahiliInput").value;
    const francais = document.getElementById("francaisInput").value;
    const etape = document.getElementById("etapeInput").value;
    const type = document.getElementById("typeInput").value;
    
    if (!swahili || !francais) {
        alert("⚠️ Veuillez remplir tous les champs obligatoires.");
        return;
    }
    
    try {
        await addDoc(collection(db, "mots_swahili"), { swahili, francais, etape, type });
        chargerMots();
        document.getElementById("swahiliInput").value = "";
        document.getElementById("francaisInput").value = "";
        document.getElementById("etapeInput").value = "";
        document.getElementById("typeInput").value = "";
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du mot :", error);
    }
}

// 📌 Fonction pour exporter les mots en JSON
async function exporterJSON() {
    try {
        const motsSnapshot = await getDocs(collection(db, "mots_swahili"));
        const mots = motsSnapshot.docs.map(doc => doc.data());
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mots, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "mots_swahili.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    } catch (error) {
        console.error("❌ Erreur lors de l'exportation :", error);
    }
}

// 📌 Fonction pour importer un fichier JSON
async function importerJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const mots = JSON.parse(e.target.result);
            for (const mot of mots) {
                await addDoc(collection(db, "mots_swahili"), mot);
            }
            chargerMots();
        } catch (error) {
            console.error("❌ Erreur lors de l'importation :", error);
        }
    };
    reader.readAsText(file);
}

// 📌 Rendre les fonctions accessibles globalement
window.ajouterMot = ajouterMot;
window.chargerMots = chargerMots;
window.exporterJSON = exporterJSON;
window.importerJSON = importerJSON;
window.modifierMot = modifierMot;
window.supprimerMot = supprimerMot;

// 📌 Charger les mots au démarrage
chargerMots();
