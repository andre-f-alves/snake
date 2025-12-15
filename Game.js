import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #intervalID = null
  #keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ArrowLeft: 'left'
  }

  #score

  constructor(screen, width, height) {
    this.screen = screen
    this.context = screen.getContext('2d')
    
    this.screenWidth = width
    this.screenHeight = height

    this.squareSize = 20

    this.frameInterval = 1000 / 15

    this.snake = new Snake(0, 0)
    this.fruit = null

    this.#score = 0
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

  get screenBoundaries() {
    const width = this.screenWidth / this.squareSize - 1
    const height = this.screenHeight / this.squareSize - 1
    return [ width, height ]
  }

  get score() {
    return this.#score
  }

  render() {
    this.#intervalID = setInterval(() => {
      this.clearScreen()
      this.drawSnake()
      this.moveSnake()

      this.spawnFruit()
      this.drawFruit()

      if (this.fruitWasEaten()) {
        this.removeFruit()
        this.growSnake()
        this.#score++
      }

      if (
        this.detectWallCollision() ||
        this.detectSelfCollision()
      ) {
        console.log(this.#score)
        this.#score = 0
        this.stopRender()
      }
    }, this.frameInterval)
  }

  stopRender() {
    clearInterval(this.#intervalID)
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)
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

  detectSelfCollision() {
    const snakeHead = this.snake.head
    const snakeBody = this.snake.body

    const selfCollision = snakeBody.some((part, i) => {
      if (i === 0) return
      return snakeHead.x === part.x && snakeHead.y === part.y
    })
    return selfCollision
  }

  detectWallCollision() {
    const snakeHead = this.snake.head
    if (
      snakeHead.x < 0 ||
      snakeHead.x > this.screenBoundaries[0] ||
      snakeHead.y < 0 ||
      snakeHead.y > this.screenBoundaries[1]
    ) {
      return true
    }
    return false
  }

  spawnFruit() {
    if (this.fruit) return

    let x = Math.random() * this.screenBoundaries[0] + 1
    let y = Math.random() * this.screenBoundaries[1] + 1
      
    const snakeBody = this.snake.body
    const isSnakePosition = () => (
      snakeBody.some(part => part.x === x && part.y === y)
    )

    while (isSnakePosition()) {
      x = Math.random() * this.screenBoundaries[0] + 1
      y = Math.random() * this.screenBoundaries[1] + 1
    }

    this.fruit = new Fruit(Math.floor(x), Math.floor(y))
  }

  drawFruit() {
    const fruit = this.fruit

    this.context.fillStyle = '#ff0055ff'
    this.context.fillRect(
      fruit.x * this.squareSize,
      fruit.y * this.squareSize,
      this.squareSize,
      this.squareSize
    )
  }

  fruitWasEaten() {
    const snakeHead = this.snake.head
    const fruit = this.fruit

    if (
      snakeHead.x === fruit.x &&
      snakeHead.y === fruit.y
    ) {
      return true
    }
    return false
  }

  removeFruit() {
    this.fruit = null
  }
}
