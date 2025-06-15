const animalEmojis = [
  "🐶", "🐱", "🐭", "🐹",
  "🐰", "🦊", "🐻", "🐼"
];
// Duplicate and shuffle the array for pairs
let boardEmojis = [];

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');

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

function createBoard() {
  boardElement.innerHTML = '';
  boardEmojis = [...animalEmojis, ...animalEmojis];
  shuffle(boardEmojis);
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  lockBoard = false;
  statusElement.textContent = '';

  boardEmojis.forEach((emoji, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = idx;

    const emojiSpan = document.createElement('span');
    emojiSpan.classList.add('emoji');
    emojiSpan.textContent = emoji;

    const back = document.createElement('span');
    back.classList.add('back');
    back.textContent = "❓";

    card.appendChild(emojiSpan);
    card.appendChild(back);

    card.addEventListener('click', () => flipCard(card));

    boardElement.appendChild(card);
  });
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

createBoard();