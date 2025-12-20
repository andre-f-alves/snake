import Renderer from './Renderer.js'
import InputHandler from './InputHandler.js'
import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #intervalID = null
  #score

  constructor(screen, screenWidth, screenHeight, squareSize) {
    this.screen = screen

    this.renderer = new Renderer(this.screen, screenWidth, screenHeight, squareSize)

    this.inputHandler = new InputHandler(this)

    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []

    this.fruit = null

    this.#score = 0

    this.frameInterval = 1000 / 10
    this.render()
    this.needReset = false
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
    const [ screenWidthBoundary, screenHeightBoundary ] = this.renderer.screenBoundaries
    if (
      snakeHead.x < 0 ||
      snakeHead.x > screenWidthBoundary ||
      snakeHead.y < 0 ||
      snakeHead.y > screenHeightBoundary
    ) {
      return true
    }
    return false
  }

  spawnFruit() {
    if (this.fruit) return

    const [ screenWidthBoundary, screenHeightBoundary ] = this.renderer.screenBoundaries

    let x = Math.random() * screenWidthBoundary + 1
    let y = Math.random() * screenHeightBoundary + 1
      
    const snakeBody = this.snake.body
    const isSnakePosition = () => (
      snakeBody.some(part => part.x === Math.floor(x) && part.y === Math.floor(y))
    )
    while (isSnakePosition()) {
      x = Math.random() * screenWidthBoundary + 1
      y = Math.random() * screenHeightBoundary + 1
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
