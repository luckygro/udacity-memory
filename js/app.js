// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
  var currentIndex = array.length; var temporaryValue; var randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function createCards () {
  // define array with content for memory cards (fontawesome icons)
  const cardsContent = [
    'fa-check-circle',
    'fa-folder-open',
    'fa-clone',
    'fa-thumbs-up',
    'fa-thumbs-down',
    'fa-play-circle',
    'fa-paper-plane',
    'fa-heart'
  ]

  // create list with cards
  const cardsList = document.createElement('ul')
  cardsList.className = 'cards'

  // create two cards for each element in cardsContent
  cardsContent.forEach(function (name) {
    // create two cards and append content
    for (let i = 0; i < 2; i++) {
      const newCard = document.createElement('li')
      newCard.className = 'card open'
      newCard.setAttribute('value', name)
      newCard.innerHTML = `
                <div class="scene">
                    <div class="front">
                        <i class="fa ${name}"></i>
                    </div>
                    <div class="back"></div>
                </div>`
      cardsList.appendChild(newCard)
    }
  })

  // append cards to game-panel
  const gamePanel = document.querySelector('.game-panel')
  gamePanel.innerHTML = ''
  gamePanel.appendChild(cardsList)
}

function shuffleCards () {
  const lengthList = gamePanelList.childNodes.length
  // shuffle order
  const indexList = Array.apply(null, { length: lengthList }).map(Number.call, Number)
  const orderList = shuffle(indexList)
  for (let i = 0; i < lengthList; i++) {
    gamePanelList.children[i].setAttribute('style', `order: ${orderList[i]};`)
  }
}

// === control game ===
// ====================

function refreshStatus () {
  document.querySelector('span.moves').textContent = counter + ' moves'
  document.querySelector('span.success').textContent = success + ' success'

  // star rating
  const stars = document.querySelectorAll('.score-panel .rating i')
  if (counter < 10) {
    stars.forEach(function (star) {
      star.classList.remove('inactive')
    })
  } else if (counter < 20) {
    stars[2].classList.add('inactive')
  } else {
    stars[1].classList.add('inactive')
  }
}

function abortGame () {
  // stop timer
  stopTimer()

  for (let i = 0; i < gamePanelList.children.length; i++) {
    gamePanelList.children[i].classList.add('open')
    gamePanelList.children[i].classList.add('solved')
  }

  document.querySelector('button.solve').setAttribute('style', 'display: none;')
  document.querySelector('button.start').textContent = 'restart'

  gamePanelList.removeEventListener('click', openCard)
}

function resetGame () {
  document.querySelector('.modal').classList.add('hidden')

  // clear global variable for next move
  cardA = undefined
  cardB = undefined

  // reset cards
  for (let i = 0; i < gamePanelList.children.length; i++) {
    gamePanelList.children[i].classList.remove('solved')
    gamePanelList.children[i].classList.remove('success')
    gamePanelList.children[i].classList.remove('open')
  }
  setTimeout(shuffleCards, 500)

  // reset timer
  timerSec = 0
  startTimer()

  success = 0
  counter = 0
  refreshStatus()

  // show solve button
  document.querySelector('button.solve').setAttribute('style', 'display: inline;')
  document.querySelector('button.start').textContent = 'restart'

  // add event listener
  gamePanelList.addEventListener('click', openCard)
}

function finishGame () {
  // stop timer
  stopTimer()

  // show modal
  const modal = document.querySelector('.modal')
  modal.classList.remove('hidden')
  modal.querySelector('.finaltime').textContent = displayTimer()

  // remove solution button
  document.querySelector('button.solve').setAttribute('style', 'display: none;')

  // remove event listener
  gamePanelList.removeEventListener('click', openCard)

  // star rating
  const stars = document.querySelectorAll('.modal .ratingfinal i')
  stars.forEach(function (star) {
    star.classList.remove('inactive')
  })
  if (counter < 20) {
    stars[2].classList.add('inactive')
  } else {
    stars[2].classList.add('inactive')
    stars[1].classList.add('inactive')
  }
}

// timer
// =====

let timer, timerSec, timerActive
timerSec = 0

function displayTimer () {
  const sec = '00' + timerSec % 60
  const min = '00' + Math.floor(timerSec / 60)
  return `${min.substr(min.length - 2)}:${sec.substr(sec.length - 2)}`
}

function operateTimer () {
  document.querySelector('.timer').textContent = displayTimer()
  timerSec++
  timer = setTimeout(operateTimer, 1000)
}

function startTimer () {
  if (!timerActive) {
    timerActive = 1
    operateTimer()
  }
}

function stopTimer () {
  clearTimeout(timer)
  timerActive = 0
  document.querySelector('.timer').textContent = displayTimer()
}

// handle game logic
// =================

function openCard (evt) {
  const card = evt.target.closest('li')

  if (card.classList.contains('open')) {
    console.log('already open')
    return
  }
  card.classList.add('open')

  // only call logic when two cards are selected
  if (cardA == undefined) {
    cardA = card
  } else {
    cardB = card
    checkCards()
  }
}

function incrementCounter () {
  counter++
  refreshStatus()
}

function handleSuccess (A, B) {
  success++
  refreshStatus()

  if (success == pairs) {
    finishGame()
  }

  A.classList.add('correct')
  B.classList.add('correct')
  setTimeout(function () {
    A.classList.add('solved')
    B.classList.add('solved')
    A.classList.remove('correct')
    B.classList.remove('correct')
  }, 2000)
}

function handleError (A, B) {
  gamePanelList.removeEventListener('click', openCard)
  setTimeout(function () {
    A.classList.remove('open')
    B.classList.remove('open')
    gamePanelList.addEventListener('click', openCard)
  }, 2000)
}

function checkCards () {
  // store objects
  const tempA = cardA
  const tempB = cardB

  // clear global variable for next move
  cardA = undefined
  cardB = undefined

  incrementCounter()

  // get values
  const valueA = tempA.attributes.value.value
  const valueB = tempB.attributes.value.value

  if (valueA == valueB) {
    handleSuccess(tempA, tempB)
  } else {
    handleError(tempA, tempB)
  }
}

// =================

// initialize page
createCards()

// cache cards
let cardA
let cardB

// counter and success
let counter = 0
let success = 0

const gamePanelList = document.querySelector('.game-panel ul')
const pairs = gamePanelList.children.length / 2

// event listener
document.querySelector('button.solve').addEventListener('click', abortGame)
document.querySelector('button.start').addEventListener('click', resetGame)
document.querySelector('button.restart').addEventListener('click', resetGame)
