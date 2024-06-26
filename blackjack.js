// blackjack.js

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let dealerHand = [];
let playerHand = [];
let dealerHandElem = document.getElementById('dealer-hand');
let playerHandElem = document.getElementById('player-hand');
let messageElem = document.getElementById('message');
let balanceElem = document.getElementById('balance');
let betInputElem = document.getElementById('bet-input');
let betAmount = 0;
let balance = 1000;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;
    while (value > 21 && aces) {
        value -= 10;
        aces -= 1;
    }
    return value;
}

function displayHands() {
    dealerHandElem.innerHTML = '';
    playerHandElem.innerHTML = '';
    dealerHand.forEach(card => {
        dealerHandElem.innerHTML += `<div class="card suit-${getSuitClass(card.suit)}" data-value="${card.value}" data-suit="${card.suit}"><span>${card.value}</span><span>${card.suit}</span></div>`;
    });
    playerHand.forEach(card => {
        playerHandElem.innerHTML += `<div class="card suit-${getSuitClass(card.suit)}" data-value="${card.value}" data-suit="${card.suit}"><span>${card.value}</span><span>${card.suit}</span></div>`;
    });
}

function getSuitClass(suit) {
    switch (suit) {
        case '♠': return 'spade';
        case '♥': return 'heart';
        case '♦': return 'diamond';
        case '♣': return 'club';
    }
}

function checkGameOver() {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) {
        messageElem.textContent = 'Player busts! Dealer wins.';
        updateBalance(-betAmount);
        return true;
    }
    if (dealerValue > 21) {
        messageElem.textContent = 'Dealer busts! Player wins.';
        updateBalance(betAmount);
        return true;
    }
    if (dealerValue >= 17) {
        if (playerValue > dealerValue) {
            messageElem.textContent = 'Player wins!';
            updateBalance(betAmount);
        } else if (playerValue < dealerValue) {
            messageElem.textContent = 'Dealer wins!';
            updateBalance(-betAmount);
        } else {
            messageElem.textContent = 'Push!';
        }
        return true;
    }
    return false;
}

function dealerPlay() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    displayHands();
    checkGameOver();
}

function updateBalance(amount) {
    balance += amount;
    balanceElem.textContent = `Balance: $${balance}`;
}

document.getElementById('place-bet').addEventListener('click', () => {
    betAmount = parseInt(betInputElem.value);
    if (betAmount > 0 && betAmount <= balance) {
        messageElem.textContent = `Bet placed: $${betAmount}`;
    } else {
        messageElem.textContent = 'Invalid bet amount';
    }
});

document.getElementById('deal').addEventListener('click', () => {
    if (betAmount <= 0 || betAmount > balance) {
        messageElem.textContent = 'Please place a valid bet.';
        return;
    }
    createDeck();
    dealerHand = [deck.pop(), deck.pop()];
    playerHand = [deck.pop(), deck.pop()];
    displayHands();
    messageElem.textContent = '';
});

document.getElementById('hit').addEventListener('click', () => {
    if (!deck.length) return;
    playerHand.push(deck.pop());
    displayHands();
    if (!checkGameOver()) {
        messageElem.textContent = 'Hit or Stand?';
    }
});

document.getElementById('stand').addEventListener('click', () => {
    dealerPlay();
});

updateBalance(0);
