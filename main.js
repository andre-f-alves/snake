import Snake from './Snake.js'

const screen = document.getElementById('screen')
const context = screen.getContext('2d')

screen.width = 600
screen.height = 600

// const displacement = 10

const snake = new Snake(context, 0, 0, 30, 30, 10)
snake.draw()

addEventListener('keydown', (e) => {
  const key = e.code
  context.clearRect(0, 0, screen.width, screen.height)
  snake.move(key)
})
