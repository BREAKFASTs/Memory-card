// =====================
// GAME DATA
// =====================
const symbols = ["🍎","🍌","🍇","🍓","🍉","🍍","🥝","🍒","🍑"];

let board = document.getElementById("board");

let score = 0;
let pairs = 0;
let time = 30;
let timer;

let first = null;
let second = null;
let lock = false;

let levelIndex = 0;
let timeAddedTotal = 0;

const levels = [
  { name: "Easy", pairs: 6, reward: 5, preview: 3500 },
  { name: "Normal", pairs: 8, reward: 4, preview: 2500 },
  { name: "Hard", pairs: 10, reward: 4, preview: 1500 },
  { name: "Master", pairs: 12, reward: 3, preview: 1000 },
  { name: "Insane", pairs: 14, reward: 3, preview: 500 },
  { name: "Chaos", pairs: 18, reward: 2, preview: 200 }
];

// =====================
// START GAME
// =====================
function startGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameScreen").style.display = "flex";

  loadBest();
  setupLevel();
  startTimer();
}

// =====================
// LEVEL SETUP
// =====================
function setupLevel() {
  let level = levels[levelIndex];

  document.getElementById("level").innerText = level.name;

  let arr = [];
  for (let i = 0; i < level.pairs; i++) {
    arr.push(symbols[i], symbols[i]);
  }

  arr.sort(() => Math.random() - 0.5);

  board.innerHTML = "";

  arr.forEach(sym => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerText = sym;
    card.dataset.value = sym;
    board.appendChild(card);

    card.addEventListener("click", flip);
  });

  // preview
  setTimeout(() => {
    document.querySelectorAll(".card").forEach(c => c.innerText = "?");
  }, level.preview);
}

// =====================
// FLIP
// =====================
function flip() {
  if (lock) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  this.innerText = this.dataset.value;

  if (!first) first = this;
  else {
    second = this;
    lock = true;
    check();
  }
}

// =====================
// MATCH CHECK
// =====================
function check() {
  if (first.dataset.value === second.dataset.value) {
    score += 10;
    pairs++;

    let reward = levels[levelIndex].reward;
    time += reward;
    timeAddedTotal += reward;

    updateUI();
    resetTurn();

    checkLevelUp();
  } else {
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      first.innerText = "?";
      second.innerText = "?";
      resetTurn();
    }, 600);
  }
}

// =====================
// LEVEL UP
// =====================
function checkLevelUp() {
  if (pairs % 6 === 0 && levelIndex < levels.length - 1) {
    levelIndex++;
    setupLevel();
  }

  // shuffle mechanic
  if (pairs % 4 === 0) shuffleCards();

  // fade mechanic
  if (pairs % 5 === 0) fadeCards();
}

// =====================
// SHUFFLE
// =====================
function shuffleCards() {
  let cards = Array.from(document.querySelectorAll(".card"));
  cards.sort(() => Math.random() - 0.5);
  board.innerHTML = "";
  cards.forEach(c => board.appendChild(c));
}

// =====================
// FADE
// =====================
function fadeCards() {
  document.querySelectorAll(".card").forEach(c => {
    if (!c.classList.contains("flipped")) {
      c.classList.add("faded");
      setTimeout(() => c.classList.remove("faded"), 1000);
    }
  });
}

// =====================
// TIMER
// =====================
function startTimer() {
  timer = setInterval(() => {
    time--;
    updateUI();

    if (time <= 0) endGame();
  }, 1000);
}

// =====================
// UI
// =====================
function updateUI() {
  document.getElementById("score").innerText = score;
  document.getElementById("pairs").innerText = pairs;
  document.getElementById("time").innerText = time;
}

// =====================
// RESET TURN
// =====================
function resetTurn() {
  first = null;
  second = null;
  lock = false;
}

// =====================
// BEST SCORE
// =====================
function loadBest() {
  let best = localStorage.getItem("best") || 0;
  document.getElementById("best").innerText = best;
}

function saveBest() {
  let best = localStorage.getItem("best") || 0;
  if (score > best) {
    localStorage.setItem("best", score);
  }
}

// =====================
// GAME OVER
// =====================
function endGame() {
  clearInterval(timer);
  saveBest();

  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("gameOver").style.display = "flex";

  document.getElementById("finalScore").innerText = score;
  document.getElementById("finalPairs").innerText = pairs;
  document.getElementById("finalLevel").innerText = levels[levelIndex].name;
  document.getElementById("finalTime").innerText = timeAddedTotal;
}

// =====================
// RESTART
// =====================
function restart() {
  location.reload();
}