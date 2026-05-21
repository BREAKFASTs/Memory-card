// =====================
// GAME DATA
// =====================
const symbols = [
  "🍎","🍌","🍇","🍓","🍉","🍍",
  "🥝","🍒","🍑","🥥","🍋","🍊",
  "🍐","🥭","🫐","🍈","🍏","🍅"
];

let board = document.getElementById("board");

let score = 0;
let pairs = 0;
let time = 30;
let timer;

let first = null;
let second = null;

let lock = false;
let previewing = false;

let levelIndex = 0;
let timeAddedTotal = 0;

const levels = [
  { name: "Easy", pairs: 6, reward: 5, preview: 3500, class: "easy" },
  { name: "Normal", pairs: 8, reward: 4, preview: 2500, class: "normal" },
  { name: "Hard", pairs: 10, reward: 4, preview: 1800, class: "hard" },
  { name: "Master", pairs: 12, reward: 3, preview: 1200, class: "master" },
  { name: "Insane", pairs: 14, reward: 3, preview: 700, class: "insane" },
  { name: "Chaos", pairs: 18, reward: 2, preview: 300, class: "chaos" }
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
// SETUP LEVEL
// =====================
function setupLevel() {

  previewing = true;
  lock = true;

  let level = levels[levelIndex];

  document.getElementById("level").innerText = level.name;

  // change board layout
  board.className = "board " + level.class;

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

  // PREVIEW LOCK FIX
  setTimeout(() => {

    document.querySelectorAll(".card").forEach(card => {
      card.innerText = "?";
    });

    previewing = false;
    lock = false;

  }, level.preview);
}

// =====================
// FLIP CARD
// =====================
function flip() {

  // FIX PREVIEW CLICK BUG
  if (previewing) return;

  if (lock) return;

  if (this === first) return;

  if (this.classList.contains("matched")) return;

  this.classList.add("flipped");
  this.innerText = this.dataset.value;

  if (!first) {

    first = this;

  } else {

    second = this;
    lock = true;

    checkMatch();
  }
}

// =====================
// CHECK MATCH
// =====================
function checkMatch() {

  if (first.dataset.value === second.dataset.value) {

    first.classList.add("matched");
    second.classList.add("matched");

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

    }, 650);
  }
}

// =====================
// LEVEL UP
// =====================
function checkLevelUp() {

  if (pairs % 6 === 0 && levelIndex < levels.length - 1) {

    levelIndex++;

    setTimeout(() => {
      setupLevel();
    }, 500);
  }

  if (pairs % 4 === 0) {
    shuffleCards();
  }

  if (pairs % 5 === 0) {
    fadeCards();
  }
}

// =====================
// SMOOTH SHUFFLE
// =====================
function shuffleCards() {

  lock = true;

  let cards = Array.from(document.querySelectorAll(".card"));

  // add shuffle animation
  cards.forEach((card, index) => {

    card.style.transition =
      "transform .45s ease, opacity .45s ease";

    // random movement
    let x = (Math.random() * 80) - 40;
    let y = (Math.random() * 80) - 40;
    let rotate = (Math.random() * 30) - 15;

    card.style.transform =
      `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(.7)`;

    card.style.opacity = "0";
  });

  // after animation
  setTimeout(() => {

    // shuffle array
    cards.sort(() => Math.random() - 0.5);

    board.innerHTML = "";

    cards.forEach(card => {

      // reset before adding back
      card.style.transform =
        "translate(0px, 0px) rotate(0deg) scale(.5)";

      card.style.opacity = "0";

      board.appendChild(card);

      // force browser repaint
      card.offsetHeight;

      // smooth pop in
      card.style.transform =
        "translate(0px, 0px) rotate(0deg) scale(1)";

      card.style.opacity = "1";
    });

    setTimeout(() => {
      lock = false;
    }, 450);

  }, 450);
}
// =====================
// FADE EFFECT
// =====================
function fadeCards() {

  document.querySelectorAll(".card").forEach(card => {

    if (!card.classList.contains("matched")) {

      card.classList.add("faded");

      setTimeout(() => {
        card.classList.remove("faded");
      }, 1000);
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

    // timer warning
    if (time <= 10) {
      document.querySelector(".timer-box").style.transform = "scale(1.05)";
    }

    if (time <= 0) {
      endGame();
    }

  }, 1000);
}

// =====================
// UPDATE UI
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