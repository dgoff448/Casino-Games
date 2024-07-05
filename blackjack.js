
var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true; //allows player to draw card

// var your_money = 10000;
if (localStorage.getItem("your_money")) {
    var your_money = localStorage.getItem("your_money");
}
else if (localStorage.getItem("your_money") <= 0) {
    localStorage.setItem("your_money", 10000);
    var your_money = 10000;
}
else {
    localStorage.setItem("your_money", 10000);
    var your_money = 10000;
}
var pot_total = 0;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i=0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i])
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    // console.log(deck);
}

function startGame() {
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("bet").addEventListener("click", bet);
    document.getElementById("your-money-amt").innerText = your_money;
}

function bet() {
    let potAmt = document.getElementById("pot-amt");
    let betAmt = document.getElementById("bet-amt");
    let monAmt = document.getElementById("your-money-amt");

    if (parseFloat(betAmt.value) > your_money || betAmt.value == "" || parseFloat(betAmt.value) < 0) {
        alert("ATTENTION: You cannot bet more than you have!")
        return;
    }

    pot_total += parseFloat(betAmt.value);
    potAmt.innerText = pot_total;
    your_money -= parseFloat(betAmt.value);
    console.log(your_money);
    monAmt.innerText = your_money;
    betAmt.value = "";

    var snd = new Audio("./sounds/chips.mp3"); // buffers automatically when created
    snd.play();

    generateCards();
}

function generateCards() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);

    document.getElementById("hidden").style.visibility = "visible";
    document.getElementById("hit").style.visibility = "visible";
    document.getElementById("stay").style.visibility = "visible";
    document.getElementById("Youh2").style.visibility = "visible";
    document.getElementById("pot").style.visibility = "visible";
    document.getElementById("dealerh2").style.visibility = "visible";

    document.getElementById("bet").style.visibility = "hidden";
    document.getElementById("bet-amt").style.visibility = "hidden";
    document.getElementById("wager-msg").style.visibility= "hidden";

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        // document.getElementById("dealer-cards")[-1].src
    }
    // console.log(hidden);
    // console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourAceCount += checkAce(card);
        yourSum += getValue(card);
        document.getElementById("your-cards").append(cardImg);
    }
    console.log(yourSum);
}


function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourAceCount += checkAce(card);
    yourSum += getValue(card);
    document.getElementById("your-cards").append(cardImg);

    

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        stay();
    }
    else {
        var snd = new Audio("./sounds/flip.mp3"); // buffers automatically when created
        snd.play();
    }
    // console.log(yourSum);
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        var snd = new Audio("./sounds/lose.mp3"); // buffers automatically when created
        snd.play();
    } 
    else if (dealerSum > 21) {
        message = "You Win $" + (pot_total * 1.5) + "!";
        your_money += (pot_total * 1.5);
        var snd = new Audio("./sounds/win.mp3"); // buffers automatically when created
        snd.play();
    }
    else if (yourSum == dealerSum) {
        message = "Tie!";
        your_money += pot_total;
    }
    else if (yourSum > dealerSum) {
        message = "You Win $" + (pot_total * 1.5) + "!";
        your_money += (pot_total * 1.5);
        var snd = new Audio("./sounds/win.mp3"); // buffers automatically when created
        snd.play();
    } else if (yourSum < dealerSum) {
        message = "You Lose!";
        var snd = new Audio("./sounds/lose.mp3"); // buffers automatically when created
        snd.play();
    }

    localStorage.setItem("your_money", your_money);

    document.getElementById("results").innerText = message;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    let playBtn = document.createElement("button");
    playBtn.setAttribute("id", "play-again-btn");
    playBtn.innerText = "Play Again";
    playBtn.addEventListener("click", playAgain);
    document.getElementById("play-again").append(playBtn);

}


function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function playAgain() {
    location.reload();
}