import Renderer from './Renderer.js'
import InputHandler from './InputHandler.js'
import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #intervalID = null
  #score = null

  constructor(screen, screenWidth, screenHeight, squareSize, onScoreChange) {
    this.screen = screen

    this.renderer = new Renderer(this.screen, screenWidth, screenHeight, squareSize)

    this.inputHandler = new InputHandler(this.screen, (direction) => {
      this.enqueueDirection(direction)
    })

    this.onScoreChange = onScoreChange

    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []

    this.fruit = null

    this.#score = 0

    this.frameInterval = 1000 / 10
    this.spawnFruit()
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
      this.update()
    }, this.frameInterval)
  }

  render() {
    this.renderer.clearScreen()
    this.renderer.renderSnake(this.snake, '#06b100ff', '#07da00ff')

    if (!this.fruit) return
    this.renderer.renderFruit(this.fruit, '#ff0055ff')
  }

  update() {
    if (this.snakeDirectionsQueue.length) {
      this.snake.changeDirection(this.dequeueDirection())
    }
    this.snake.move()

    if (!this.fruit) this.spawnFruit()
    
    if (this.fruitWasEaten()) {
      this.removeFruit()
      this.snake.grow()
      this.#score++

      this.onScoreChange(this.score)
    }
        
    if (
      this.detectWallCollision() ||
      this.detectSelfCollision()
    ) {
      this.stop()
      this.needReset = true
    }
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

    this.onScoreChange(this.score)
  }

  enqueueDirection(direction) {
    if (!direction) return

    const index = this.snakeDirectionsQueue.length - 1
    const lastDirection = this.snakeDirectionsQueue[index]

    if (lastDirection && direction === lastDirection) return

    const maxDirections = 3
    if (this.snakeDirectionsQueue.length >= maxDirections) return

    this.snakeDirectionsQueue.push(direction)
  }

  dequeueDirection() {
    return this.snakeDirectionsQueue.shift()
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
    const [ screenWidthBoundary, screenHeightBoundary ] = this.renderer.screenBoundaries

    let x = Math.floor(Math.random() * (screenWidthBoundary + 1))
    let y = Math.floor(Math.random() * (screenHeightBoundary + 1))

    const snakeBody = this.snake.body
    const isSnakePosition = () => (
      snakeBody.some(part => part.x === x && part.y === y)
    )
    while (isSnakePosition()) {
      x = Math.floor(Math.random() * (screenWidthBoundary + 1))
      y = Math.floor(Math.random() * (screenHeightBoundary + 1))
    }

    this.fruit = new Fruit(x, y)
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
