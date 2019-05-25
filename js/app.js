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

function resetCards() {
    for (i=0;i<gamePanelList.children.length;i++) {
        gamePanelList.children[i].classList.remove("solved");
        gamePanelList.children[i].classList.remove("success");
        gamePanelList.children[i].classList.remove("open");
    }
}

// timer
// =====

let timer, timer_sec, timer_active;
timer_sec = 0;

function displayTimer() {
    const sec = "00" + timer_sec % 60;
    const min = "00" + Math.floor(timer_sec / 60);
    document.querySelector('.timer').textContent = `${min.substr(min.length-2)}:${sec.substr(sec.length-2)}`;
}

function operateTimer() {
    displayTimer();
    timer_sec++;
    timer = setTimeout(operateTimer, 1000);
}

function startTimer() {
    if(!timer_active) {
        timer_active = 1;
        operateTimer();
    }
}

function stopTimer() {
    clearTimeout(timer);
    timer_active = 0;
}

// handle game logic
// =================

function openCard(evt) {
    const card = evt.target.closest('li');

    if (card.classList.contains("open")) {
        console.log('already open')
        return;
    }

    card.classList.add("open");

    // only call logic when two cards are selected
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

function handleSuccess(A, B) {
    
    success++;
    document.querySelector('span.success').textContent = success + ' success';
    
    if (success == pairs) {
        handleFinish();
    }

    A.classList.add('correct');
    B.classList.add('correct');
    setTimeout(function() {
        A.classList.add('solved');
        B.classList.add('solved');
        A.classList.remove('correct');
        B.classList.remove('correct');
    }, 2000)  
}

function handleError(A,B) {
    setTimeout(function() {
        A.classList.remove('open');
        B.classList.remove('open');
    }, 2000)   
}

function handleFinish() {
    stopTimer();
    console.log('finished');
    const modal = document.querySelector('.modal');
    modal.setAttribute('style', "display: block;");
}

function checkCards() {

    // store objects
    const tempA = cardA;
    const tempB = cardB;

    // clear global variable for next move
    cardA = undefined;
    cardB = undefined;

    incrementCounter();

    // get values
    const valueA = tempA.attributes.value.value;
    const valueB = tempB.attributes.value.value;

    if (valueA == valueB) {
        handleSuccess(tempA, tempB);
    } else {
        handleError(tempA, tempB);        
    }
}

// initialize page
createCards();

// cache cards
let cardA = undefined;
let cardB = undefined;

// counter and success
let counter = 0;
let success = 0;

const gamePanelList = document.querySelector('.game-panel ul');
const pairs = gamePanelList.children.length / 2;
gamePanelList.addEventListener('click',function(evt) {
    openCard(evt);
});

// event listener
document.querySelector('button.shuffle').addEventListener('click', shuffleCards);

document.querySelector('button.solve').addEventListener('click', showCards);

document.querySelector('button.start').addEventListener('click', function () {
    resetCards();
    setTimeout(shuffleCards, 1000);
    startTimer();
});

