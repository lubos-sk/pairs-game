const allEmojis = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺",
  "🐗", "🐴", "🦄", "🐝", "🪲", "🐞", "🦋", "🐌"
];

let boardEmojis = [];
let animalEmojis = [];
let gridSize = 4; // default
let numPairs = 8; // default for 4x4
let cardSize = 80; // default (medium)

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const boardSizeSelect = document.getElementById('board-size');
const cardSizeSelect = document.getElementById('card-size');

let flippedCards = [];
let matchedCards = [];
let lockBoard = false;
let moves = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateGridStyle() {
  boardElement.style.gridTemplateColumns = `repeat(${gridSize}, ${cardSize}px)`;
}

function updateCardStyles() {
  // Use a higher ratio for animal emoji font size (e.g., 60% of card size)
  const emojiFontSize = Math.round(cardSize * 0.6);
  const backFontSize = Math.round(cardSize * 0.4);

  document.querySelectorAll('.card').forEach(card => {
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
  });
  document.querySelectorAll('.card .emoji').forEach(span => {
    span.style.fontSize = `${emojiFontSize}px`;
  });
  document.querySelectorAll('.card .back').forEach(span => {
    span.style.fontSize = `${backFontSize}px`;
  });
}

function createBoard() {
  boardElement.innerHTML = '';
  updateGridStyle();

  numPairs = (gridSize * gridSize) / 2;
  animalEmojis = allEmojis.slice(0, numPairs);

  boardEmojis = [...animalEmojis, ...animalEmojis];
  shuffle(boardEmojis);
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  lockBoard = false;
  statusElement.textContent = '';

  // Calculate font sizes based on card size
  const emojiFontSize = Math.round(cardSize * 0.6);
  const backFontSize = Math.round(cardSize * 0.4);

  boardEmojis.forEach((emoji, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = idx;
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;

    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('emoji');
    emojiSpan.textContent = emoji;
    emojiSpan.style.fontSize = `${emojiFontSize}px`;

    const back = document.createElement('span');
    back.classList.add('back');
    back.textContent = "❓";
    back.style.fontSize = `${backFontSize}px`;

    card.appendChild(emojiSpan);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card));

    boardElement.appendChild(card);
  });

  updateCardStyles();
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    lockBoard = true;
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
      // Match
      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        flippedCards = [];
        lockBoard = false;
        if (matchedCards.length === boardEmojis.length) {
          statusElement.textContent = `🎉 You won in ${moves} moves!`;
        }
      }, 500);
    } else {
      // Not a match
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
      }, 900);
    }
  }
}

resetButton.addEventListener('click', createBoard);

boardSizeSelect.addEventListener('change', function() {
  gridSize = parseInt(this.value, 10);
  createBoard();
});

cardSizeSelect.addEventListener('change', function() {
  cardSize = parseInt(this.value, 10);
  createBoard();
});

// Initial game
createBoard();