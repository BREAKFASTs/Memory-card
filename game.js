const symbols = ["🍎","🍌","🍇","🍓","🍉","🍍"];

let board = document.getElementById("board");
let first = null;
let lock = false;

// =====================
// START GAME
// =====================
function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameScreen").style.display = "flex";

    setup();
}

// =====================
// SETUP BOARD
// =====================
function setup() {

    let arr = [];

    for (let i = 0; i < 3; i++) {
        arr.push(symbols[i], symbols[i]);
    }

    arr.sort(() => Math.random() - 0.5);

    board.innerHTML = "";
    board.style.gridTemplateColumns = "repeat(3, 70px)";

    arr.forEach(sym => {
        let card = document.createElement("div");
        card.className = "card";
        card.innerText = "?";
        card.dataset.value = sym;

        card.onclick = flip;
        board.appendChild(card);
    });
}

// =====================
// FLIP LOGIC
// =====================
function flip() {

    if (lock) return;
    if (this === first) return;

    this.innerText = this.dataset.value;

    if (!first) {
        first = this;
    } else {

        lock = true;

        if (first.dataset.value === this.dataset.value) {
            first = null;
            lock = false;
        } else {

            setTimeout(() => {
                first.innerText = "?";
                this.innerText = "?";
                first = null;
                lock = false;
            }, 600);
        }
    }
}

// =====================
// HOW TO PLAY
// =====================
function showHowToPlay() {
    document.getElementById("howModal").style.display = "flex";
    runDemo();
}

function closeHowToPlay() {
    document.getElementById("howModal").style.display = "none";
}

// =====================
// DEMO ANIMATION
// =====================
function runDemo() {

    let cards = document.querySelectorAll(".demo-card");
    let text = document.getElementById("stepText");

    cards.forEach(c => c.classList.remove("flip"));
    text.innerText = "Memorize the cards";

    setTimeout(() => {

        text.innerText = "Cards are hidden. Find pairs!";

        cards.forEach(c => {
            c.innerText = "?";
            c.classList.add("flip");
        });

    }, 2000);

    setTimeout(() => {

        text.innerText = "Match identical pairs!";

        cards[0].innerText = "🍎";
        cards[1].innerText = "🍌";
        cards[2].innerText = "🍎";
        cards[3].innerText = "🍌";

        cards.forEach(c => c.classList.remove("flip"));

    }, 4500);
}