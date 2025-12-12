import Game from './Game.js'

const screen = document.getElementById('screen')
const game = new Game(screen, 600, 600)


game.render()
// game.stopRender()
// game.drawSnake()

// const context = screen.getContext('2d')

// screen.width = 600
// screen.height = 600

// const squareSize = 20

// const snake = new Snake(context, squareSize)
// snake.draw()

addEventListener('keydown', (e) => {
  const key = e.code
  // console.log(e)
  if (key.startsWith('Arrow')) {
    e.preventDefault()
    game.changeSnakeDirection(key)
  }

  if (key === 'Space') {
    e.preventDefault()
    game.growSnake()
  }
})
