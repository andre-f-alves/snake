import Renderer from './Renderer.js'
import InputHandler from './InputHandler.js'
import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #intervalID = null
  #score = 0
  #onScoreChange

  constructor(screen, screenConfig, onScoreChange) {
    this.screen = screen

    this.renderer = new Renderer(this.screen, screenConfig)

    this.inputHandler = new InputHandler(this.screen, (direction) => {
      this.enqueueDirection(direction)
    })

    this.#onScoreChange = onScoreChange

    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []

    this.fruit = null

    this.frameInterval = 1000 / 10
    this.needReset = false
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

  render(selfCollisionPoint = null) {
    this.renderer.clearScreen()
    this.renderer.renderSnake(this.snake, selfCollisionPoint)

    if (!this.fruit) this.spawnFruit()
    this.renderer.renderFruit(this.fruit)
  }

  update() {
    if (this.snakeDirectionsQueue.length) {
      this.snake.changeDirection(this.dequeueDirection())
    }

    const selfCollisionPoint = this.detectSelfCollision()
    if (this.detectWallCollision() || selfCollisionPoint) {
      this.stop()
      this.render(selfCollisionPoint)
    }

    const willEatFruit = this.eatFruit()
    this.snake.move(willEatFruit)
    
    if (willEatFruit) {
      this.removeFruit()
      this.#score++
      this.#onScoreChange(this.#score)
      this.spawnFruit()
    }
  }

  stop() {
    clearInterval(this.#intervalID)
    this.#intervalID = null
    this.needReset = true
  }

  reset() {
    this.snake = new Snake(0, 0)
    this.snakeDirectionsQueue = []
    this.fruit = null
    this.#score = 0

    this.#onScoreChange(this.#score)
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
    const nextSnakeMove = this.snake.getNextMove()
    const snakeBody = this.snake.body

    const selfCollision = snakeBody.find((part) => {
      return nextSnakeMove.x === part.x && nextSnakeMove.y === part.y
    })

    return selfCollision || null
  }

  detectWallCollision() {
    const nextSnakeMove = this.snake.getNextMove()
    const [ maxX, maxY ] = this.renderer.screenBoundaries

    const isOutOfWidthBoundary = nextSnakeMove.x < 0 || nextSnakeMove.x > maxX
    const isOutOfHeightBoundary = nextSnakeMove.y < 0 || nextSnakeMove.y > maxY
    return isOutOfWidthBoundary || isOutOfHeightBoundary
  }

  spawnFruit() {
    const [ maxX, maxY ] = this.renderer.screenBoundaries

    let x = Math.floor(Math.random() * (maxX + 1))
    let y = Math.floor(Math.random() * (maxY + 1))

    const snakeBody = this.snake.body
    const isSnakePosition = () => (
      snakeBody.some(part => part.x === x && part.y === y)
    )
    while (isSnakePosition()) {
      x = Math.floor(Math.random() * (maxX + 1))
      y = Math.floor(Math.random() * (maxY + 1))
    }

    this.fruit = new Fruit(x, y)
  }

  eatFruit() {
    const nextSnakeMove = this.snake.getNextMove()
    const fruit = this.fruit
    return nextSnakeMove.x === fruit.x && nextSnakeMove.y === fruit.y
  }

  removeFruit() {
    this.fruit = null
  }
}
