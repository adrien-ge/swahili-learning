
const mots = [
    { sw: "Asubuhi", fr: "Matin" },
    { sw: "Chakula", fr: "Nourriture" },
    { sw: "Rafiki", fr: "Ami" },
    { sw: "Shule", fr: "École" },
    { sw: "Maji", fr: "Eau" },
  ];
  
  let motActuel;
  
  function choisirMotAleatoire() {
    return mots[Math.floor(Math.random() * mots.length)];
  }
  
  function melanger(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function chargerNouveauMot() {
    motActuel = choisirMotAleatoire();
  
    const wordElement = document.getElementById("swahiliWord");
    const optionsContainer = document.getElementById("optionsContainer");
  
    wordElement.textContent = motActuel.sw;
    optionsContainer.innerHTML = "";
  
    const mauvaisesReponses = mots.filter(m => m.fr !== motActuel.fr);
    const distracteurs = melanger(mauvaisesReponses).slice(0, 2).map(m => m.fr);
    const toutesOptions = melanger([motActuel.fr, ...distracteurs]);
  
    toutesOptions.forEach((optionTexte, index) => {
      const bouton = document.createElement("button");
      bouton.textContent = optionTexte;
      bouton.className = "quiz-btn option-btn";
      bouton.dataset.correct = optionTexte === motActuel.fr;
      bouton.onclick = () => verifierReponse(index);
      optionsContainer.appendChild(bouton);
    });
  
    // Réinitialiser l’état visuel des boutons pour mobile
    setTimeout(() => {
      document.querySelectorAll(".quiz-btn").forEach(btn => {
        btn.blur();
        btn.classList.remove("bounce");
        btn.disabled = false;
      });
    }, 100);
  }
  
  function verifierReponse(index) {
    const boutons = document.querySelectorAll(".quiz-btn");
    const message = document.getElementById("message");
  
    const boutonClique = boutons[index];
    boutonClique.blur();
  
    let correct = boutonClique.dataset.correct === "true";
  
    // Supprime tous les styles de hover/focus bloqués
    boutons.forEach(btn => {
      btn.blur();
      btn.disabled = true;
    });
  
    if (correct) {
      message.textContent = "✅ Bonne réponse !";
      message.style.color = "green";
  
      boutonClique.classList.add("bounce");
  
      setTimeout(() => {
        boutonClique.classList.remove("bounce");
        message.textContent = "";
        chargerNouveauMot();
      }, 1000);
    } else {
      message.textContent = "❌ Mauvaise réponse, essayez encore.";
      message.style.color = "red";
    }
  }
  
  document.addEventListener("DOMContentLoaded", chargerNouveauMot);
  