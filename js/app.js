// Array to hold icons for shuffling and generating HTML
const icons = ['fas fa-globe', 'fas fa-globe',
            'fas fa-bicycle', 'fas fa-bicycle',
            'fas fa-ship', 'fas fa-ship',
            'fas fa-space-shuttle', 'fas fa-space-shuttle',
            'fas fa-train', 'fas fa-train',
            'fas fa-taxi', 'fas fa-taxi',
            'fas fa-bus', 'fas fa-bus',
            'fas fa-map', 'fas fa-map',
            ];

let seconds;
let minutes;
let moves = 0;
let openCards = [];
let totalMatches = 0;
let counter;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Timer to track time spent playing a round
function timer() {
  const pageTimer = document.querySelector('.timer');

  if (seconds < 9) {
    seconds += 1;
    pageTimer.innerText = `${minutes} : 0${seconds}`;
  }
  else if (seconds < 59) {
    seconds += 1;
    pageTimer.innerText = `${minutes} : ${seconds}`;
  }  else {
    minutes += 1;
    seconds = 0;
    pageTimer.innerText = `${minutes} : ${seconds}`;
  }
}

// Display the cards on the page by looping through each card and creating its HTML
const deck = document.querySelector('.deck');
function displayCards(icons) {
  for (const icon of icons) {
    deck.innerHTML += `<li class="card"><i class="${icon}"></i></li>`;
  }
}

// Tracks the number of moves per round for the user
const movesCounter = document.querySelector('.moves');
const stars = document.querySelector('.stars');
function countMoves() {
  moves += 1;
  movesCounter.innerHTML = moves;
  console.log(stars.innerHTML);

  return moves;
}

// Creates a star rating based on the number of moves the user took to complete a round
function starRating(moves) {
  if (moves == 14) {
    stars.removeChild(stars.childNodes[0]);
  }
  else if (moves == 24) {
    stars.removeChild(stars.childNodes[2]);
  }
  else {
    // do nothing
  }
}

// Adds classes when the user clicks on a card
function showSymbols(card) {
  card.classList.add('open', 'show');
}

// Adds the card to a list of "open" cards when the user clicks on the card
function savingCards(card) {
  openCards.push(card);

  if (openCards.length === 2) {
    let a = openCards[0].firstElementChild.classList[1];
    let b = openCards[1].firstElementChild.classList[1];
    if (a == b) {
      matching();
    }
    else {
      notMatching();
    }
  }
}

/*
When the two open cards do
have the same icon, class 'yay' is added briefly,
class 'match' is added for the round,
# of moves is incremented
and star rating is updated.
*/
function matching() {
  openCards.forEach(function(card) {
    card.classList.add('yay');
  });

  setTimeout(function() {
    openCards.forEach(function(card) {
      card.classList.remove('yay');
      card.classList.add('match');
    });
  openCards = [];
  }, 500);

  countMoves();
  starRating(moves);
  totalMatches++;
  if (totalMatches == 8) {
    win();
  }
}

/*
When the two open cards do NOT have the same icon, the class 'nay'
is added briefly. Classes 'open' and 'show' are removed. # of moves is
incremented and star rating is updated.
*/
function notMatching() {
  openCards.forEach(function (card) {
    card.classList.add('nay');
  });

  setTimeout(function () {
    openCards.forEach(function (card) {
      card.classList.remove('open', 'show');
      card.classList.remove('nay');
    });
    openCards = [];
  }, 500);

  countMoves();
  starRating(moves);
}

/*
When the total number of matches equals 8,
a modal appears to let the user know they've successfully completed a round.
The modal provides the user's time, # of moves, and star rating
*/
const modal = document.querySelector('.modal');
function win() {
  clearInterval(counter);
  document.querySelector('.modal-text').innerHTML = `<p>Great Job!</p>\
    <p>Time: ${minutes}:${seconds}</p><p>Moves: ${moves}</p>\
    <p>${stars.innerHTML}</p>`;
  modal.style.display = "block";
}

// Clears board and restarts timer, moves counter
function clear() {
  // Clears board
  deck.innerHTML = '';
  openCards = [];

  // Restores default star rating
  stars.innerHTML = `<li><i class="fas fa-star"></i></li>\
  <li><i class="fas fa-star"></i></li>\
  <li><i class="fas fa-star"></i></li>`;

  // Restarts moves counter
  moves = 0;
  movesCounter.innerHTML = moves;
  totalMatches = 0;

  // Restarts timer
  seconds = -1;
  minutes = 0;
  counter = setInterval(timer, 1000);
}

// Event listener for restart button/icon
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function(e) {
  init();
});


// Event listener for Play Again button in modal
const playAgainButton = document.querySelector('.play-again');
playAgainButton.addEventListener('click', function(e) {
  modal.style.display = "none";
  init();
});


// Event listener for exit button in modal
const exitButton = document.querySelector('.exit');
exitButton.addEventListener('click', function(e) {
  modal.style.display = "none";
});

/*
Prepares the game for another round by
calling several other functions and
adding an event listener to each card
*/
function init() {
  clear();
  shuffle(icons);
  displayCards(icons);
  timer();

  // Event listener for cards
  const cards = document.querySelectorAll('.card');
  for (const card of cards) {
    card.addEventListener('click', function(event) {
      if (openCards.length <= 2 && !card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
        showSymbols(card);
        savingCards(card);
      }
    });
  }
}

init();
