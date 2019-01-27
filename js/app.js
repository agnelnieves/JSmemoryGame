// Shuffle function from http://stackoverflow.com/a/2450976

//  Global variables

let timerID;
let time            = 0;
let moves           = 0;
let matched         = 0;
let timerOff        = true;
let toggledCards    = [];
const TOTAL_PAIRS   = 8; // Total pairs: For validation
const deck          = document.querySelector('.deck');
const timer         = document.querySelector('.timer');


// Shuffles deck
function deckShuffle() {
    const cardListToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards     = shuffle(cardListToShuffle);

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

        // Validates max amount of cards allowed by pairs
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
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget) &&
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match')
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
    // If first card in the array matches the second
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

        // If matches the total amount of pairs (End game)
        if ( matched === TOTAL_PAIRS ) {
            gameOver();
        }

    } else {
        // Flips clicked cards after 1s
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

// Displays timer on element
function displayTimer() {
    const minutes = Math.floor( time / 60 );
    const seconds = time % 60;

    // Time formatting
    if (seconds < 10 ) {

        timer.innerHTML = `${minutes}:0${seconds}`;

    } else {
        timer.innerHTML = `${minutes}:${seconds}`;
    }
}

// Stops time
function stopTimer() {
    clearInterval(timerID);
}

// shuffle function from http://stackoverflow.com/a/2450976
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


// Moves counter

function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

// Analyze score and determine star status
function analyzeScore() {
    if ( moves == 16 || moves == 24 ) {
        hideStar();
        hideModalStars();
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

// Reset game

document.querySelector('.restart').addEventListener('click', reset);

function reset() {
    resetTimer();
    resetMoves();
    resetStars();
    deckShuffle();
    resetCards();
}

function resetTimer() {
    time =0;
    stopTimer();
    displayTimer();
    timerOff = true;
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

writeModalStats();

function toggleModal() {
    const modal = document.querySelector('.modal__overlay');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal__time');
    const timer = document.querySelector('.timer').innerHTML;
    const moveStat = document.querySelector('.modal__moves');
    const starsStat = document.querySelector('.modal__stars').innerHTML;

    const minutes = Math.floor( time / 60 );
    const seconds = time % 60;

    if (seconds < 10 ) {

        timeStat.innerHTML = `Time: ${minutes}:0${seconds}`;

    } else {
        timeStat.innerHTML = `Time: ${minutes}:${seconds}`;
    }

    moveStat.innerHTML = `Moves: ${moves}`;
}

function hideModalStars() {
    const starList = document.querySelectorAll('.modal__stars li');
    for (star of starList) {
        if ( star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
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
    toggleModal();
    reset();
}