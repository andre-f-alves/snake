import Game from './Game.js'

const screen = document.getElementById('screen')
const game = new Game(screen)

game.drawSnake()

addEventListener('keydown', (e) => {
  const key = e.code
  if (key.startsWith('Arrow')) {
    e.preventDefault()
    game.moveSnake(key)
  }

  if (key === 'Space') {
    e.preventDefault()
    game.growSnake()
  }
})
