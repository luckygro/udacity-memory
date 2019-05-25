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

function createCards() {
    // define array with content for memory cards (fontawesome icons)
    const cardsContent = [
        "fa-check-circle",
        "fa-folder-open",
        "fa-clone",
        "fa-thumbs-up",
        "fa-thumbs-down",
        "fa-play-circle",
        "fa-paper-plane",
        "fa-heart"
    ];

    // create list with cards
    const cardsList = document.createElement('ul');
    cardsList.className = "cards"

    // create two cards for each element in cardsContent
    cardsContent.forEach(function(name) {

        // create two cards and append content
        for (i=0;i<2;i++) {
            const newCard = document.createElement('li');
            newCard.className = "card open";
            newCard.setAttribute('value',name);
            newCard.innerHTML = `
                <div class="scene">
                    <div class="front">
                        <i class="fa ${name}"></i>
                    </div>
                    <div class="back"></div>
                </div>`;
            cardsList.appendChild(newCard);
        }    
    })

    // append cards to game-panel
    const gamePanel = document.querySelector('.game-panel');
    gamePanel.innerHTML = "";
    gamePanel.appendChild(cardsList);
}

function shuffleCards() {
    const lengthList = gamePanelList.childNodes.length;
    // shuffle order
    const indexList = Array.apply(null, {length: lengthList}).map(Number.call, Number);
    const orderList = shuffle(indexList);
    for (i=0;i<lengthList;i++) {
        gamePanelList.children[i].setAttribute('style', `order: ${orderList[i]};`);
    }
}

function hideCards() {
    for (i=0;i<gamePanelList.children.length;i++) {
        gamePanelList.children[i].classList.remove("open");
    }
}

function showCards() {
    for (i=0;i<gamePanelList.children.length;i++) {
        gamePanelList.children[i].classList.add("open");
        gamePanelList.children[i].classList.add("solved");
    }
}

function openCard(evt) {
    const card = evt.target.closest('li');

    if (card.classList.contains("open")) {
        console.log('already open')
        return;
    }

    card.classList.add("open");

    if (cardA == undefined) {
        cardA = card;
    } else {
        cardB = card;
        checkCards();
    }
}

function incrementCounter() {
    counter++;
    document.querySelector('span.moves').textContent = counter + ' moves';
}

function checkCards() {

    incrementCounter();
    const tempA = cardA;
    const tempB = cardB;
    cardA = undefined;
    cardB = undefined;
    const valueA = tempA.attributes.value.value;
    const valueB = tempB.attributes.value.value;

    if (valueA == valueB) {
        console.log('success')
        success++;
        tempA.classList.add('correct');
        tempB.classList.add('correct');
        setTimeout(function() {
            tempA.classList.add('solved');
            tempB.classList.add('solved');
            tempA.classList.remove('correct');
            tempB.classList.remove('correct');
        }, 2000)   
    } else {
        console.log('wrong')
        setTimeout(function() {
            tempA.classList.remove('open');
            tempB.classList.remove('open');
        }, 2000)   
    }
}

createCards();

// cache cards
let cardA = undefined;
let cardB = undefined;

// counter and success
let counter = 0;
let success = 0;

const gamePanelList = document.querySelector('.game-panel ul');
const pairs = gamePanelList.children.length;
gamePanelList.addEventListener('click',function(evt) {
    openCard(evt);
});

// event listener
document.querySelector('button.shuffle').addEventListener('click', function () {
    console.log('The cards are shuffled');
    shuffleCards();
  });

document.querySelector('button.start').addEventListener('click', function () {
    hideCards();
    shuffleCards();
});

document.querySelector('button.solve').addEventListener('click', function () {
    console.log('show the result');
    showCards();
});

