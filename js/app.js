//  Globals

const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
const timer = document.querySelector('.timer');
let timerOff = true;
let time = 0;
let timerID;
let matched = 0;
const TOTAL_PAIRS = 8;

function deckShuffle() {
    const cardListToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardListToShuffle);

    // Appending shuffled cards to deck
    for ( card of shuffledCards ) {
        deck.appendChild(card);
    }
}

deckShuffle();

deck.addEventListener('click', event => {

    const clickTarget = event.target;

    // If match, execute
    if ( clickValidation(clickTarget) ) {

        // Toggle card and limit toggle to two cards at a time
        toggleCard(clickTarget);
        addToggledCard(clickTarget);

        if ( toggledCards.length == 2 ) {
            checkIfMatched();
            addMove();
            analyzeScore();
        }

        // Timer
        if ( timerOff ) {
            startTimer();
            timerOff = false;
        }
    }

});

// Validates matches
function clickValidation(clickTarget) {
    return(
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
    );
}

// Toggle function
function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

// Once toggled, card is added to array toggledCard[]
function addToggledCard(clickTarget) {
    toggledCards.push(clickTarget);
}

// Matching card validation
function checkIfMatched() {
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className
    ) {
        // Adding match class
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        // Resetting the array
        matched++;

        if ( matched === TOTAL_PAIRS ) {
            gameOver();
        }

    } else {

        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);
    }
}

// Game Timer

function startTimer() {
         timerID = setInterval(() => {
        time++;
        displayTimer();
    }, 1000);
}

function displayTimer() {
    const minutes = Math.floor( time / 60 );
    const seconds = time % 60;

    if (seconds < 10 ) {

        timer.innerHTML = `${minutes}:0${seconds}`;

    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

function stopTimer() {
    clearInterval(timerID);
}



// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Moves counter function

function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

// Analyze score and determine star status
function analyzeScore() {
    if ( moves == 16 || moves == 24 ) {
        hideStar();
    }
}

// Hides star
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if ( star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

// Reset

document.querySelector('.restart').addEventListener('click', reset);

function reset() {
    resetTimer();
    resetMoves();
    resetStars();
    deckShuffle();
    resetCards();
}

function resetTimer() {
    stopTimer();
    timerOff = true;
    time =0;
    displayTimer();
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

// Modal

// Modal test
time = 121;
// displayTime();
moves = 16;
// checkScore();

// writeModalStats();
// toggleModal();

function toggleModal() {
    const modal = document.querySelector('.modal__overlay');
    modal.classList.toggle('hide');
}

// toggleModal();

function writeModalStats() {
    const timeStat = document.querySelector('.modal__time');
    const timer = document.querySelector('.timer').innerHTML;
    const moveStat = document.querySelector('.modal__moves').innerHTML;
    const starsStat = document.querySelector('.modal__stars').innerHTML;

    timeStat.innerHTML = `Time: ${time}`;
    moveStat.innerHTML = `Time: ${moves}`;
    // starsStat.innerHTML = `${stars}`;
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none' ) {
            starCount++;
        }
    }

    console.log(starCount);
    return starCount;
}



document.querySelector('.modal__cancel').addEventListener('click', () => {
    toggleModal();
});

document.querySelector('.modal__close-btn').addEventListener('click', () => {
    toggleModal();
});

document.querySelector('.modal__replay').addEventListener('click', replayGame);

// Game over
function gameOver() {
    stopTimer();
    writeModalStats();
    toggleModal();
}

// Replay game
function replayGame() {
    reset();
    toggleModal();
}