$(document).ready(function () {
  let timer; // Timer variable
  let timeLeft = 60; // Starting time for level 1
  let totalTime = 0; // Total time to complete level
  let sentence = "";
  let correctWords = 0; // Words correctly typed
  let isGameActive = false;
  let username = "";
  let sentencesCompleted = 0; // To track number of sentences completed
  let currentLevel = 1; // Track the current level

  // Sentences for different levels
  const level1Sentences = [
      "The quick brown fox jumps over the lazy dog.",
      "JavaScript is fun to learn.",
      "Coding challenges improve your skills.",
      "Practice typing to increase speed.",
      "A watched pot never boils.",
      "You can achieve anything with persistence."
  ];

  const level2Sentences = [
      "Complex algorithms can solve many problems efficiently.",
      "Debugging is an essential skill for software developers.",
      "JavaScript provides asynchronous functionality through callbacks.",
      "Understanding closures is important for advanced programming.",
      "Practice makes perfect, and coding is no exception.",
      "A good developer writes clean, efficient code."
  ];

  const level3Sentences = [
      "Recursion is a fundamental concept in computer science and programming.",
      "JavaScript's event loop enables non-blocking asynchronous execution.",
      "Understanding promises and async-await is key to mastering asynchronous code.",
      "Functional programming relies on the use of higher-order functions and immutability.",
      "Developers must manage state efficiently when building scalable applications.",
      "Comprehending time complexity allows programmers to optimize algorithms."
  ];

  let sentences = level1Sentences; // Default to level 1 sentences

  // Fix: Added autocomplete attribute to username input
  $("#username").attr("autocomplete", "off");

  // Start game when button is clicked
  $("#start-game").click(function () {
      username = $("#username").val().trim();

      if (username === "") {
          alert("Please enter your username.");
          return;
      }

      $("#display-username").text("Hello, " + username + "!");
      $("#game-area").removeClass("hidden");
      $("#splash-screen").addClass("hidden");
      startGame();
  });

  // Timer function
  function startGame() {
      resetGame();
      isGameActive = true;
      $("#game-area").removeClass("hidden"); // Fix: Ensure game area is visible
      timer = setInterval(updateCountdown, 1000);
      generateSentence();
  }

  function updateCountdown() {
      timeLeft--;
      totalTime++;
      $("#countdown").text(timeLeft + "s");

      if (timeLeft <= 0) {
          endGame(false); // Time ran out, no win
      }
  }

  // Generate random sentence
  function generateSentence() {
      if (sentencesCompleted >= sentences.length) {
          endGame(true); // All sentences completed, game won
          return;
      }

      sentence = sentences[sentencesCompleted]; // Move to the next sentence in order
      $("#random-sentence").text(sentence);
      $("#user-input").val("").focus();
  }

  // Check typing accuracy
  $("#user-input").on("input", function () {
      const userInput = $(this).val().trim();
      const sentenceWords = sentence.split(" ");
      const inputWords = userInput.split(" ");

      correctWords = inputWords.reduce((acc, word, index) => {
          return word === sentenceWords[index] ? acc + 1 : acc;
      }, 0);

      if (userInput === sentence) {
          sentencesCompleted++; // Move to the next sentence
          generateSentence(); // Generate the next sentence
      }

      updateWPM();
  });

  // Update words per minute (WPM)
  function updateWPM() {
      const wpm = Math.round((correctWords / (60 - timeLeft)) * 60);
      $("#wpm").text("Words per minute: " + (isNaN(wpm) ? 0 : wpm));
  }

  // End game (either win or timeout)
  function endGame(won) {
      clearInterval(timer);
      isGameActive = false;

      if (won) {
          // Player completed all sentences
          showScoreboard(true); // Show scoreboard with next level option
      } else {
          // Time ran out
          showScoreboard(false); // Show scoreboard with "Try Again" and restart option
      }
  }

  // Show scoreboard after completing or failing a level
  function showScoreboard(won) {
      $("#scoreboard-username").text(username);
      $("#scoreboard-correct-words").text(correctWords);
      $("#scoreboard-time").text(totalTime + " seconds");

      $("#scoreboard").removeClass("hidden");
      $("#game-area").addClass("hidden");

      if (won) {
          // Display the correct level completed dynamically based on `currentLevel`
          $("#scoreboard-level").text("Level " + currentLevel + " Completed!");  // Ensure the level completion message is updated dynamically

          if (currentLevel < 3) {
              $("#next-level").removeClass("hidden");
              $("#restart").addClass("hidden"); // Hide restart button until last level
          } else {
              $("#next-level").addClass("hidden");
              $("#restart").removeClass("hidden"); // Show restart after completing level 3
          }
      } else {
          $("#next-level").addClass("hidden");
          $("#restart").removeClass("hidden"); // Allow restart after failure
          $("#try-again").removeClass("hidden");
      }
  }

  // Reset game variables
  function resetGame() {
      timeLeft = currentLevel === 1 ? 60 : currentLevel === 2 ? 50 : 45; // Time decreases for higher levels
      totalTime = 0;
      correctWords = 0;
      sentencesCompleted = 0;
      $("#countdown").text(timeLeft + "s");
      $("#wpm").text("Words per minute: 0");
      $("#game-over").addClass("hidden");
      $("#you-won").addClass("hidden");
      $("#scoreboard").addClass("hidden");
      $("#try-again").addClass("hidden");
  }

  // Restart game from level 1
  $("#restart").click(function () {
      currentLevel = 1; // Reset to level 1
      sentences = level1Sentences; // Set sentences back to level 1
      $("#splash-screen").removeClass("hidden");
      $("#game-over").addClass("hidden");
      $("#game-area").addClass("hidden");
      resetGame();
  });

  // Move to next level
  $("#next-level").click(function () {
      if (currentLevel === 1) {
          currentLevel = 2;
          sentences = level2Sentences; // Use level 2 sentences
      } else if (currentLevel === 2) {
          currentLevel = 3; // Move to level 3
          sentences = level3Sentences; // Use level 3 sentences
      }

      // Hide scoreboard when starting the next level
      $("#scoreboard").addClass("hidden");
      resetGame();
      startGame(); // Start game again for the next level
  });
});