const questions = [
  "What is the capital of France?",
  "What is the largest ocean?",
  "What gas do plants absorb?"
];

const answers = [
  "Paris",
  "Pacific Ocean",
  "Carbon Dioxide"
];

let currentIndex = 0;

const front = document.querySelector(".front");
const back = document.querySelector(".back");
const nextButton = document.getElementById("nexta");
const returnButton = document.getElementById("returna");
const flashcard = document.querySelector(".flashcard");

function updateCard() {
  front.textContent = "Question: " + questions[currentIndex];
  back.textContent = "Answer: " + answers[currentIndex];
}

function fadeToCard(direction) {
  flashcard.classList.add("fade-out");

  setTimeout(() => {
    // Update content while invisible
    if (direction === "next") {
      currentIndex = (currentIndex + 1) % questions.length;
    } else {
      currentIndex = (currentIndex - 1 + questions.length) % questions.length;
    }

    updateCard();
    flashcard.classList.remove("fade-out");
  }, 300); // match transition duration
}

nextButton.addEventListener("click", () => fadeToCard("next"));
returnButton.addEventListener("click", () => fadeToCard("prev"));

updateCard();
