import Game from './Game.js'

function changeTheme() {
  const htmlElement = document.documentElement

  const currentTheme = localStorage.getItem('theme')
  const mode = currentTheme === 'light' ? 'dark' : 'light'
  
  localStorage.setItem('theme', mode)
  htmlElement.classList.remove(`${currentTheme}-theme`)
  htmlElement.classList.add(`${mode}-theme`)
}

let currentTheme = localStorage.getItem('theme') || 'light'
document.documentElement
  .classList.add(`${currentTheme}-theme`)

const themeButton = document.getElementById('theme-button')
themeButton.addEventListener('click', changeTheme)


function updateScore(score=0) {
  const scoreOutput = document.getElementById('score')
  const highScoreOutput = document.getElementById('high-score')
  
  const highScore = localStorage.getItem('highScore') || 0

  scoreOutput.textContent = score
  highScoreOutput.textContent = highScore

  if (score > highScore) {
    localStorage.setItem('highScore', score)
    highScoreOutput.textContent = localStorage.getItem('highScore')
  }
}

updateScore()

function calcScreenDimensions(screen) {
  const outerPadding = getComputedStyle(document.querySelector('body')).padding.replace('px', '')
  const minWindowWidth = 768
  const squareSize = 15

  let widthCalc = Math.floor((innerWidth - outerPadding * 2) / squareSize) * squareSize
  const heightCalc = Math.floor((innerHeight - screen.offsetTop - outerPadding) / squareSize) * squareSize
  
  screen.height = heightCalc

  if (innerWidth >= minWindowWidth) {
    widthCalc = Math.floor((innerWidth - screen.offsetLeft - outerPadding) / squareSize) * squareSize
  }

  screen.width = widthCalc
}

const screen = document.getElementById('screen')

calcScreenDimensions(screen)

const screenConfig = {
  width: screen.width,
  height: screen.height,
  squareSize: 15
}

const game = new Game(screen, screenConfig, updateScore)
game.render()

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  if (game.isRunning) game.stop()
  game.start()
  startButton.textContent = 'Reiniciar'
})

onresize = () => {
  calcScreenDimensions(screen)

  if (game.isRunning) {
    game.stop()
    startButton.textContent = 'Iniciar'
  } else {
    game.reset()
  }

  game.render()
}
