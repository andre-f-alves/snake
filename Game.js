import Snake from './Snake.js'

export default class Game {
  #keyMoves

  constructor(screen) {
    this.screen = screen
    this.context = screen.getContext('2d')

    this.screen.width = 600
    this.screen.height = 600

    this.squareSize = 20

    this.widthBoudary = this.screen.width / this.squareSize
    this.heightBoudary = this.screen.height / this.squareSize

    this.#keyMoves = {
      ArrowUp: 'moveUp',
      ArrowDown: 'moveDown',
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
    }

    this.snake = new Snake(this.context, this.squareSize)
  }

  drawSnake() {
    this.snake.draw()
  }

  moveSnake(key) {
    this.context.clearRect(0, 0, screen.width, screen.height)
    this.snake.move(this.#keyMoves[key])
  }

  growSnake() {
    this.snake.grow()
  }
}
