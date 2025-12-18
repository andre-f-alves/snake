import Game from './Game.js'

const screen = document.getElementById('screen')

const game = new Game(screen, 600, 600)

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  if (game.isRunning) game.stop()
  game.start()
})

const scoreOutput = document.getElementById('score')

setInterval(() => {
  scoreOutput.textContent = game.score
})
