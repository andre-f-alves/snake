import Snake from './Snake.js'

export default class Game {
  #keyMap

  constructor(screen, width, height) {
    this.screen = screen
    this.context = screen.getContext('2d')
    
    this.screenWidth = width
    this.screenHeight = height

    this.squareSize = 20

    this.widthBoundary = this.screenWidth / this.squareSize
    this.heightBoudary = this.screenHeight / this.squareSize
    
    this.intervalID = null

    this.snake = new Snake(this.squareSize)
    
    this.#keyMap = {
      ArrowUp: 'Up',
      ArrowDown: 'Down',
      ArrowLeft: 'Left',
      ArrowRight: 'Right',
    }
  }

  get screenWidth() {
    return this.screen.width
  }

  get screenHeight() {
    return this.screen.height
  }

  set screenWidth(value) {
    this.screen.width = value
  }

  set screenHeight(value) {
    this.screen.height = value
  }

  render() {
    this.intervalID = setInterval(() => {
      this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.drawSnake()
      this.moveSnake()
    }, 90)
  }

  stopRender() {
    clearInterval(this.intervalID)
  }

  drawSnake() {
    const headColor = '#06b100ff'
    const bodyColor = '#07da00ff'

    const snakeBody = this.snake.body
    snakeBody.forEach((part, i) => {
      this.context.fillStyle = i === 0 ? headColor : bodyColor
      this.context.fillRect(
        part.x * this.squareSize,
        part.y * this.squareSize,
        this.squareSize,
        this.squareSize
      )
    })
  }

  moveSnake() {
    this.snake.move()
  }

  changeSnakeDirection(key) {
    const direction = this.#keyMap[key]
    if (!direction) return
    this.snake.changeDirection(direction)
  }

  growSnake() {
    this.snake.grow()
  }
}
