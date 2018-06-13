/*
 * Create a list that holds all of your cards
 */
const icons = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb", "fa fa-bolt", "fa fa-bolt"];

const cardsContainer = document.querySelector(".deck"),
  secondsContainer = document.querySelector("#seconds"),
  minutesContainer = document.querySelector("#minutes"),
  hoursContainer = document.querySelector("#hours");


let openedCards = [],
  matchedCards = [],
  firstClick = true,
  totalTime = 0,
  hours, minutes, seconds,
  incrementer;



/* 
 * Initzalize the game
 */
function init() {
  // Shuffle the current `icons`
  const iconsList = shuffle(icons);
  for (i = 0; i < icons.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="${icons[i]}"></i>`;
    cardsContainer.appendChild(card);

    //add click event
    click(card);
  }

}

/*
 *Click event
 */

function click(card) {
  //card click event
  card.addEventListener("click", function () {


    // The First Click? Start the timer!
    if (firstClick) {

      startTimer();

      firstClick = false; // This will prevent the timer to start again if the user clicked on another card
    }

    const currentCard = this;
    const previousCard = openedCards[0];

    //we have an existing OPENED card
    if (openedCards.length === 1) {
      card.classList.add("open", "show", "disable");
      openedCards.push(this);
      //we compare our 2 opened cards
      compare(currentCard, previousCard);
    } else {
      //we dont have any opened cards
      currentCard.classList.add("open", "show", "disable");
      openedCards.push(this);
    }
  });
}
/*
 * compare 2 cards
 */
function compare(currentCard, previousCard) {
  if (currentCard.innerHTML === previousCard.innerHTML) {
    // matched
    currentCard.classList.add("match");
    previousCard.classList.add("match");
    matchedCards.push(currentCard, previousCard);
    openedCards = [];

    //check is game over
    isOver();
  } else {
    openedCards = [];
    //wait 500 ms then do this
    setTimeout(function () {
      currentCard.classList.remove("open", "show", "disable");
      previousCard.classList.remove("open", "show", "disable");
    }, 500);
  }
  // Add new move
  addMove();
}

/*
 * Check if the game is over
 */
function isOver() {
  if (matchedCards.length === icons.length) {
    console.log("game is over");
    stopTimer();
  }
}

/*
 * Timer [ Start ] 
 */

function startTimer() {
  // Start Incrementer
  incrementer = setInterval(function () {

    // Add totalTime by 1
    totalTime += 1;

    // Convert Total Time to H:M:S
    calculateTime(totalTime);

    // Change the current time values
    secondsContainer.innerHTML = seconds;
    minutesContainer.innerHTML = minutes;
    hoursContainer.innerHTML = hours;
  }, 1000);
}

/*
 * Timer [ Calculate Time ] 
 */
function calculateTime(totalTime) {
  hours = Math.floor(totalTime / 60 / 60);
  minutes = Math.floor((totalTime / 60) % 60);
  seconds = totalTime % 60;
}

/*
 * Timer [ Stop ] 
 */
function stopTimer() {
  // Stop Timer
  clearInterval(incrementer);
}

/*
 * Add move
 */
const movesContainer = document.querySelector(".moves");
let moves = 0;
movesContainer.innerHTML = 0;

function addMove() {
  moves++;
  movesContainer.innerHTML = moves;
  //Set the rating
  rating();
}

/*
 *Rating
 */
const starContainer = document.querySelector(".stars");

function rating() {
  switch (moves) {
    case 15:
      starContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>`;
      break;
    case 25:
      starContainer.innerHTML = `<li><i class="fa fa-star"></i></li>`;
      break;
    case 30:
      starContainer.innerHTML = ``;

  }
}

/*
 * Restart button
 */

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", function () {
  // Delete all cards
  cardsContainer.innerHTML = "";
  // Call init to create new cards
  init();
  // Reset any related variables
  matchedCards = [];
  moves = 0;
  movesContainer.innerHTML = moves;
  starContainer.innerHTML =
    `<li><i class="fa fa-star"></i></li>
                <li><i class="fa fa-star"></i></li>
                <li><i class ="fa fa-star"></i></li> `;
  stopTimer();
  totalTime = 0;
  firstClick = true;
  hours = 0;
  minutes = 0;
  seconds = 0;
  hoursContainer.innerHTML = "00";
  minutesContainer.innerHTML = "00";
  secondsContainer.innerHTML = "00";
});


/*  
 * Start the game first time
 */
init();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}