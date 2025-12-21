import Game from './Game.js'

function changeTheme() {
  const body = document.querySelector('body')

  const currentTheme = localStorage.getItem('theme')
  const mode = currentTheme === 'light' ? 'dark' : 'light'
  
  localStorage.setItem('theme', mode)
  body.classList.remove(`${currentTheme}-theme`)
  body.classList.add(`${mode}-theme`)
}

let currentTheme = localStorage.getItem('theme')
if (!currentTheme) {
  localStorage.setItem('theme', 'light')
  currentTheme = localStorage.getItem('theme')
}

document.querySelector('body')
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

const screen = document.getElementById('screen')
const game = new Game(screen, 600, 600, 20, updateScore)

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  if (game.isRunning) game.stop()
  game.start()
  startButton.textContent = 'Reiniciar'
})
