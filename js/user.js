// user.js

import { db, auth } from "./firebase-config.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Variable locale pour éviter la recréation du device_id
let _deviceId;

// 📌 Fonction fiable pour récupérer ou générer un device_id unique
function obtenirDeviceID() {
  if (_deviceId) return _deviceId;

  _deviceId = localStorage.getItem("device_id");
  if (!_deviceId) {
    _deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", _deviceId);
    console.log("🆕 Nouveau device_id généré :", _deviceId);
  } else {
    console.log("🔁 Device ID existant :", _deviceId);
  }

  return _deviceId;
}

// 📌 Connexion anonyme à Firebase
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Connecté anonymement à Firebase");
    chargerUtilisateur();
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion anonyme :", error);
  });

// 📌 Charger ou créer l'utilisateur dans Firestore
async function chargerUtilisateur() {
  const deviceId = obtenirDeviceID();
  await obtenirIP(); // Facultatif si tu veux enregistrer l'IP
  const docRef = doc(db, "users", deviceId);
  const docSnap = await getDoc(docRef);

  let utilisateur;

  if (docSnap.exists()) {
    utilisateur = docSnap.data();
    console.log("✅ Utilisateur existant chargé :", utilisateur);
  } else {
    utilisateur = {
      nom: "",
      device_id: deviceId,
      leçon: "Aucune",
      score: 0,
      dateInscription: new Date()
    };

    await setDoc(docRef, utilisateur);
    console.log("👤 Nouvel utilisateur enregistré :", utilisateur);
  }

  // 📌 Affichage du prénom dans le header si existant
  const nomElement = document.getElementById("nomUtilisateur");
  if (nomElement && utilisateur.nom) {
    nomElement.textContent = `Bienvenue ${utilisateur.nom} !`;
  }

  // 🎯 Formulaire de prénom : affichage/masquage
  const form = document.getElementById("formPrenom");
  const modifierBtn = document.getElementById("modifierPrenomBtn");

  if (form && modifierBtn) {
    if (utilisateur.nom) {
      form.style.display = "none";
      modifierBtn.style.display = "inline-block";
    } else {
      form.style.display = "block";
      modifierBtn.style.display = "none";
    }
  }
}

// 📌 Fonction pour récupérer l'adresse IP publique
async function obtenirIP() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    localStorage.setItem("last_ip", data.ip);
    return data.ip;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'IP :", error);
    return "Inconnue";
  }
}

// 📌 Gestion du formulaire de prénom
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPrenom");
  const input = document.getElementById("inputPrenom");
  const modifierBtn = document.getElementById("modifierPrenomBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const prenom = input.value.trim();
      if (!prenom) return;

      const deviceId = obtenirDeviceID();
      const userRef = doc(db, "users", deviceId);

      try {
        await updateDoc(userRef, { nom: prenom });
        document.getElementById("nomUtilisateur").textContent = `Bienvenue, ${prenom} !`;
        input.value = "";
        form.style.display = "none";
        if (modifierBtn) modifierBtn.style.display = "inline-block";
      } catch (error) {
        console.error("Erreur lors de la mise à jour du prénom :", error);
      }
    });
  }

  if (modifierBtn) {
    modifierBtn.addEventListener("click", () => {
      form.style.display = "block";
      modifierBtn.style.display = "none";
    });
  }
});

// 📤 Exporte les fonctions utiles
export { chargerUtilisateur, obtenirDeviceID };
