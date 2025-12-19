import Renderer from './Renderer.js'
import InputHandler from './InputHandler.js'
import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #intervalID = null
  #score

  constructor(screen, width, height, squareSize) {
    this.screen = screen
    this.context = screen.getContext('2d')
    
    this.screenWidth = width
    this.screenHeight = height

    this.squareSize = squareSize

    this.renderer = new Renderer(this.screen, this.squareSize)

    this.inputHandler = new InputHandler(this)

    this.frameInterval = 1000 / 15

    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []

    this.fruit = null

    this.#score = 0

    this.render()
    this.needReset = false
    console.log(this.screenWidth, this.screenHeight)
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

  get isRunning() {
    return this.#intervalID !== null
  }

  start() {
    if (this.needReset) this.reset()
    if (this.snakeDirectionsQueue.length) this.snakeDirectionsQueue = []

    this.#intervalID = setInterval(() => {
      this.render()
      
      if (this.fruitWasEaten()) {
        this.removeFruit()
        this.growSnake()
        this.#score++
      }

      if (
        this.detectWallCollision() ||
        this.detectSelfCollision()
      ) {
        this.stop()
        this.needReset = true
      }
    }, this.frameInterval)

  }

  render() {
      this.renderer.clearScreen()
      
      this.renderer.renderSnake(this.snake, '#06b100ff', '#07da00ff')

      if (this.snakeDirectionsQueue.length) {
        const direction = this.dequeueDirection()
        this.snake.changeDirection(direction)
      }
      this.moveSnake()

      this.spawnFruit()
      this.renderer.renderFruit(this.fruit, '#ff0055ff')
  }

  stop() {
    clearInterval(this.#intervalID)
    this.#intervalID = null
  }

  reset() {
    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []
    this.fruit = null
    this.#score = 0

    this.inputHandler.reset()
  }  

  moveSnake() {
    this.snake.move()
  }

  enqueueDirection(direction) {
    if (!direction) return
    this.snakeDirectionsQueue.push(direction)
  }

  dequeueDirection() {
    return this.snakeDirectionsQueue.shift()
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
      snakeBody.some(part => part.x === Math.floor(x) && part.y === Math.floor(y))
    )
    while (isSnakePosition()) {
      x = Math.random() * this.screenBoundaries[0] + 1
      y = Math.random() * this.screenBoundaries[1] + 1
    }

    this.fruit = new Fruit(Math.floor(x), Math.floor(y))
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
