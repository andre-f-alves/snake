import Game from './Game.js'

const startButton = document.getElementById('start')

const screen = document.getElementById('screen')
const game = new Game(screen, 600, 600)

startButton.addEventListener('click', () => game.render())

const scoreOutput = document.getElementById('score')

setInterval(() => {
  scoreOutput.textContent = game.score
})
