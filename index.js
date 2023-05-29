
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const fullNameInput = document.getElementById("fname");
const startButton = document.getElementById("start");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const numOfCardsSelect = document.getElementById("numOfCards");
const nameParagraph = document.getElementById("p");
let cards;
let interval;
let flippedCard1 = null;
let flippedCard2 = null;
const flipSound = document.getElementById("flipSound");
const endSound = document.getElementById("endd");


// Cards
const items = [
  { name: "bee", image: "cards/bee.png" },
  { name: "bat", image: "cards/bat.png" },
  { name: "bear", image: "cards/bear.png" },
  { name: "butterfly", image: "cards/butterfly.png" },
  { name: "camel", image: "cards/camel.png" },
  { name: "cat", image: "cards/cat.png" },
  { name: "chameleon", image: "cards/chameleon.png" },
  { name: "clown-fish", image: "cards/clown-fish.png" },
  { name: "crab", image: "cards/crab.png" },
  { name: "crocodile", image: "cards/crocodile.png" },
  { name: "dinosaur", image: "cards/dinosaur.png" },
  { name: "dog", image: "cards/dog.png" },
  { name: "fox", image: "cards/fox.png" },
  { name: "hen", image: "cards/hen.png" },
  { name: "eagle", image: "cards/eagle.png" },
  { name: "hedgehog", image: "cards/hedgehog.png" },
  { name: "horse", image: "cards/horse.png" },
  { name: "jellyfish", image: "cards/jellyfish.png" },
  { name: "koala", image: "cards/koala.png" },
  { name: "lion", image: "cards/lion.png" },
  { name: "livestock", image: "cards/livestock.png" },
  { name: "otter", image: "cards/otter.png" },
  { name: "panda", image: "cards/panda.png" },
  { name: "sheep", image: "cards/sheep.png" },
  { name: "sloth", image: "cards/sloth.png" },
  { name: "snail", image: "cards/snail.png" },
  { name: "toucan", image: "cards/toucan.png" },
  { name: "turtle", image: "cards/turtle.png" },
  { name: "whale", image: "cards/whale.png" },
  { name: "wild-pig", image: "cards/wild-pig.png" }
];

let seconds = 0,
  minutes = 0;
let movesCount = 0,
  winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

const shuffleCards = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const createCards = (numOfPairs) => {
  movesCount = 0;
  winCount = 0;
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;

  gameContainer.innerHTML = "";

  const shuffledItems = shuffleCards(items); // Shuffle all the items

  const selectedItems = shuffledItems.slice(0, numOfPairs);
  const duplicatedItems = selectedItems.flatMap((item) => [item, { ...item }]);
  const shuffledPairs = shuffleCards(duplicatedItems);

  cards = shuffledPairs.map((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${item.image}" alt="${item.name}">
        </div>
      </div>
    `;

    card.addEventListener("click", handleCardClick);
    return card;
  });

  cards.forEach((card) => {
    gameContainer.appendChild(card);
  });
};

const playFlipSound = () => {
  flipSound.currentTime = 0; // Reset the audio to the beginning
  flipSound.play(); // Play the sound
};

const handleCardClick = (e) => {
  const currentCard = e.currentTarget;

  if (!flippedCard1) {
    flippedCard1 = currentCard;
    flippedCard1.classList.add("flip");
  } else if (!flippedCard2 && currentCard !== flippedCard1) {
    flippedCard2 = currentCard;
    flippedCard2.classList.add("flip");
    movesCounter();
    checkCards();
  }
  
  playFlipSound(); // Play the flip sound for every click
};

const checkCards = () => {
  const firstCardName = flippedCard1.querySelector(".card-back img").alt;
  const secondCardName = flippedCard2.querySelector(".card-back img").alt;

  if (firstCardName === secondCardName) {
    flippedCard1.removeEventListener("click", handleCardClick);
    flippedCard2.removeEventListener("click", handleCardClick);
    flippedCard1 = null;
    flippedCard2 = null;
    winCount += 1;
    if (winCount === cards.length / 2) {
      endGame();
    }
  } else {
    setTimeout(() => {
      flippedCard1.classList.remove("flip");
      flippedCard2.classList.remove("flip");
      flippedCard1 = null;
      flippedCard2 = null;
    }, 1000);
  }
};

const endGame = () => {
  clearInterval(interval);

  const congratsMessage = document.createElement("div");
  congratsMessage.innerHTML = `Congratulations ${fullNameInput.value.trim()}! You completed the game in ${movesCount} moves and time of ${minutes}:${seconds < 10 ? `0${seconds}` : seconds} minutes.`;
  congratsMessage.style.backgroundColor = "lightgray";
  congratsMessage.style.color = "black";
  congratsMessage.style.padding = "10px";
  congratsMessage.style.borderRadius = "5px";
  congratsMessage.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  congratsMessage.style.marginBottom = "10px";

  gameContainer.innerHTML = ""; // Remove all cards

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.addEventListener("click", restartGame);

  controls.innerHTML = ""; // Remove all contents from the controls container
  controls.appendChild(congratsMessage);
  controls.appendChild(restartButton);
  controls.style.display = "flex";
  controls.style.flexDirection = "column";
  controls.style.alignItems = "center";
  controls.style.justifyContent = "center";

  playSound(endSound); // Play the end game sound
};

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play();
};



const restartGame = () => {
  location.reload();
};

const startGame = () => {
  const fullName = fullNameInput.value.trim();

  if (!fullName) {
    alert("Please enter your name to start the game.");
    return;
  }

  nameParagraph.innerHTML = `Hello ${fullName}!`;

  const numOfPairs = parseInt(numOfCardsSelect.value, 10);
  createCards(numOfPairs);
  interval = setInterval(timeGenerator, 1000);

  startButton.removeEventListener("click", startGame);
  startButton.disabled = true;
};

startButton.addEventListener("click", startGame);
