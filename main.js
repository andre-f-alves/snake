import Game from './Game.js'

function changeTheme() {
  const body = document.querySelector('body')

  const currentTheme = localStorage.getItem('theme')
  const mode = currentTheme === 'light' ? 'dark' : 'light'
  
  localStorage.setItem('theme', mode)
  body.classList.remove(`${currentTheme}-theme`)
  body.classList.add(`${mode}-theme`)
}

const currentTheme = localStorage.getItem('theme')
if (!currentTheme) localStorage.setItem('theme', 'light')
document.querySelector('body')
  .classList.add(`${currentTheme}-theme`)

const themeButton = document.getElementById('theme-button')
themeButton.addEventListener('click', changeTheme)

const screen = document.getElementById('screen')
const game = new Game(screen, 600, 600, 20)

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  if (game.isRunning) game.stop()
  game.start()
  startButton.textContent = 'Reiniciar'
})

const scoreOutput = document.getElementById('score')
const highscoreOutput = document.getElementById('highscore')
setInterval(() => {
  const gameScore = game.score
  const gameHighScore = localStorage.getItem('highscore')

  scoreOutput.textContent = gameScore
  highscoreOutput.textContent = gameHighScore || 0

  if (!gameHighScore || gameScore > gameHighScore) {
    localStorage.setItem('highscore', gameScore)
  }
})
