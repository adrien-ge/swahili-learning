// Définition des questions du quiz
const questions = [
    { question: "Comment dit-on 'Bonjour' en swahili ?", answer: "Jambo" },
    { question: "Comment dit-on 'Merci' en swahili ?", answer: "Asante" }
    // Vous pouvez ajouter d'autres questions ici
  ];
  
  let currentIndex = 0;
  let currentQuestion = questions[currentIndex];
  
  // Afficher la première question dans l'élément HTML
  function loadQuestion() {
    const questionElem = document.getElementById("question");
    questionElem.textContent = currentQuestion.question;
  }
  
  // Fonction pour lire le texte de la question
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sw-TZ';
    speechSynthesis.speak(utterance);
  }
  
  document.getElementById("speakBtn").addEventListener("click", function() {
    speak(currentQuestion.question);
  });
  
  // Initialiser la reconnaissance vocale
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'sw-TZ';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById("result").textContent = "Vous avez dit : " + transcript;
      if (transcript.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
        alert("Bonne réponse !");
      } else {
        alert("Mauvaise réponse. La bonne réponse était : " + currentQuestion.answer);
      }
      // Passage à la question suivante si disponible
      currentIndex++;
      if (currentIndex < questions.length) {
        currentQuestion = questions[currentIndex];
        loadQuestion();
      } else {
        alert("Quiz terminé !");
      }
    };
  
    recognition.onerror = function(event) {
      console.error("Erreur de reconnaissance vocale :", event.error);
    };
  
    document.getElementById("startRecognition").addEventListener("click", function() {
      recognition.start();
    });
  } else {
    alert("Votre navigateur ne supporte pas la reconnaissance vocale Web.");
  }
  
  // Charger la première question lors du chargement de la page
  window.onload = loadQuestion;
  