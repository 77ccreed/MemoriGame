const repeat = document.querySelector(".fa-repeat"),
  time = document.getElementById("time"),
  moves = document.querySelector(".moves"),
  popup = document.querySelector(".popup"),
  panel_stars = document.querySelector(".stars").innerHTML,
  score_moves = document.querySelector(".score_moves"),
  score_time = document.querySelector(".score_time"),
  deck = document.querySelector(".deck"),
  Replay = document.querySelector(".Replay");

let m = 0,
  s = 0,
  sec,
  min,
  i = 0,
  gamestart = false,
  redo = false,
  card = document.getElementsByClassName("card"),
  cards = [...card],
  timer,
  start = false,
  list = [],
  counter_matched = 0,
  counter = 0,
  score_stars = document.querySelector(".score_stars"),
  stars = document.querySelectorAll(".fa-star");

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function init() { // to shuffle cards of the list, then remove the old order and set the new one by manipulating the DOM
  let div = "",
    HTML = "";
  deck.innerHTML = "";
  cards = shuffle(cards);
  for (i = 0; i < 16; i += 1) {
    div = cards[i].outerHTML;
    HTML = HTML.concat(div);
  }
  deck.innerHTML = HTML;
  card = document.getElementsByClassName("card");
  cards = [...card];
}


function write(s, m) {
  sec = (s < 10) ? "0" + s : s;
  min = (m < 10) ? "0" + m : m;
  time.textContent = min + ":" + sec;
}

write(s, m);
moves.textContent = counter;

let timer_function = function () {

  timer = setInterval(function () {
    "use strict";

    if (s < 59) {

      s += 1;
    }

    if (s === 59) {

      s = 0;
      m += 1;
    }
    write(s, m);
  }, 1000);

};

//toggle 
function flip(arg) {
  arg.classList.toggle("closed");
  arg.classList.toggle("open");
}

function close_matched(arg) {
  arg.classList.toggle("closed");
  arg.classList.toggle("match");
}


function match(arg) {
  arg.classList.toggle("open");
  arg.classList.toggle("match");
}

function error(arg) {
  arg.classList.toggle("open");
  arg.classList.toggle("error");
}

function flip_error(arg) {
  arg.classList.toggle("error");
  arg.classList.toggle("closed");
}


function display_counter() {
  counter += 1;
  moves.textContent = counter;
}

function game() {

  if ((this.classList.contains("closed")) && (list.length < 2)) { //when we click on a closed card & when we compare it to only one other card
    flip(this); //open the card
    if (gamestart === false || redo === true) {
      timer_function(); //if it is the first card to be clicked (we just started the game) : start the timer
      gamestart = true;
      redo = false; // in case we have clicked the restart button this variable is to disable the clearInterval function (enable the timer)
    }
    list.push(this); //we add the card to the list of open cards
    display_counter();


    if (list.length === 1) { //if there is only one open card : we don't want it to flip if we click it again

      this.removeEventListener("click", game);
    } else if (list.length === 2) { //if there are two open cards we compare their symbols

      if (list[0].firstElementChild.classList.item(1) === this.firstElementChild.classList.item(1)) {

        counter_matched += 1;

        setTimeout(function () {
          match(list[0]);
          match(list[1]);
        }, 1000);

        if (counter_matched === 8) { //if the game is won pop-up the modal
          matched();
          init();
        }


      } else { //if the two open cards do not match
        setTimeout(function () {
          error(list[1]);
          error(list[0]);
        }, 1000);
        setTimeout(function () {
          flip_error(list[1]);
          flip_error(list[0]);
        }, 2000);

      }
      setTimeout(function () { //in both cases finally: we clear the list of open cards
        list.pop();
        list.pop();
      }, 2001);

    }

  }

  delstars();

}

function delstars() {
  if (counter > 20) {
    stars[2].remove();
  }
  if (counter > 28) {
    stars[1].remove();
  }
}

function matched() {
  setTimeout(write(s, m), 0);
  clearInterval(timer);
  popup.classList.remove("hidden");
  score_moves.textContent = counter + "  ";
  score_stars.innerHTML = document.querySelector(".stars").innerHTML;
  score_time.textContent = "  " + time.textContent;
  Replay.addEventListener("click", restart);
}


function restart() {
  popup.classList.add("hidden");
  list.splice(0, list.length);
  counter_matched = 0;
  counter = 0;
  document.querySelector(".stars").innerHTML = panel_stars;
  if (redo === false) {
    clearInterval(timer);
    redo = true;
  }
  for (i = 0; i < 16; i += 1) {
    cards[i].classList.remove("open");
    cards[i].classList.remove("match");
    cards[i].classList.add("closed");
  }
  moves.textContent = 0;
  s = 0;
  m = 0;
  write(s, m);
}

init();
repeat.addEventListener("click", restart);
repeat.addEventListener("click", init);

for (const card of cards) {
  card.addEventListener("click", game);
  card.addEventListener("dblclick", game);
}