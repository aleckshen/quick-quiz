export let currentQuestionIndex = 0;

export const scores = {
  player1: 0,
  player2: 0
};

export const cooldown = {
  player1: false,
  player2: false
};

let gameLocked = false;
let currentCorrectIndex = null;
let timer = null;
let timeLeft = 10;
let savedQuestions = [];

export function shuffleOptions(q) {
  const options = [...q.options];
  const correct = options[0];
  const shuffled = options.sort(() => Math.random() - 0.5);
  return {
    question: q.question,
    options: shuffled,
    correctIndex: shuffled.indexOf(correct)
  };
}

export function loadQuestion(index, list) {
  if (list) savedQuestions = list;
  const questions = savedQuestions;

  if (index >= questions.length) {
    endGame();
    return;
  }

  const q = shuffleOptions(questions[index]);
  document.querySelector(".question h1").textContent = q.question;

  ["answer1", "answer2", "answer3", "answer4"].forEach((id, i) => {
    const el = document.getElementById(id);
    el.textContent = q.options[i];
    el.onclick = () => checkAnswer(i, q.correctIndex);
  });

  currentCorrectIndex = q.correctIndex;
  updateScoreboard();
  startTimer();
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert("Correct!");
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  } else {
    alert("Wrong!");
  }
}

export function endGame() {
    const p1 = scores.player1;
    const p2 = scores.player2;
  
    let winner = "Draw";
    if (p1 > p2) winner = "Player 1";
    else if (p2 > p1) winner = "Player 2";
  
    const url = new URL('win.html', window.location.href);
    url.searchParams.set('winner', winner);
    url.searchParams.set('p1', p1);
    url.searchParams.set('p2', p2);
  
    window.location.href = url.toString();
  }
  


document.addEventListener("keydown", e => {
  const keyMap = {
    w: 0, a: 3, s: 2, d: 1,
    ArrowUp: 0, ArrowLeft: 3, ArrowDown: 2, ArrowRight: 1
  };

  const key = e.key;
  const index = keyMap[key];
  const player = "wasd".includes(key.toLowerCase()) ? "player1" : key.startsWith("Arrow") ? "player2" : null;

  if (index !== undefined && player) handleAnswer(index, player);
});

function handleAnswer(index, player) {
    if (cooldown[player] || gameLocked) return;
  
    const isCorrect = index === currentCorrectIndex;
    const playerEl = document.getElementById(player);
  
    if (isCorrect) {
      clearInterval(timer);
      scores[player]++;
      updateScoreboard();
  
      playerEl.classList.add("correct-flash");
      setTimeout(() => playerEl.classList.remove("correct-flash"), 2000);
  
      gameLocked = true;
      showNextRoundCountdown();
    } else {
      scores[player]--;
      updateScoreboard();
  
      cooldown[player] = true;
      playerEl.classList.add("cooldown-flash");
      setTimeout(() => {
        cooldown[player] = false;
        playerEl.classList.remove("cooldown-flash");
      }, 2000);
    }
  }
  

function updateScoreboard() {
    document.getElementById("player1").textContent = `Player 1: ${scores.player1}`;
    document.getElementById("player2").textContent = `Player 2: ${scores.player2}`;
  }
  

function startTimer() {
  clearInterval(timer);
  timeLeft = 20;
  document.getElementById("time-remaining").textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-remaining").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameLocked = true;
    
      const box = document.getElementById("next-round-message");
      box.textContent = "Time's up!";
      box.style.display = "block";
    
      setTimeout(() => {
        showNextRoundCountdown(); // now transition into the countdown
      }, 1000); // show Time's up! for 1 second
    }
  }, 1000);
}



function showNextRoundCountdown(delay = 2) {
  let t = delay;
  const box = document.getElementById("next-round-message");
  box.textContent = `Next question in ${t}...`;
  box.style.display = "block";

  const interval = setInterval(() => {
    t--;
    if (t > 0) {
      box.textContent = `Next question in ${t}...`;
    } else {
      clearInterval(interval);
      box.style.display = "none";
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
      gameLocked = false;
    }
  }, 1000); 
}
