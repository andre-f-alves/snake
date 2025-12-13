import Snake from './Snake.js'
import Fruit from './Fruit.js'

export default class Game {
  #keyMap

  constructor(screen, width, height) {
    this.screen = screen
    this.context = screen.getContext('2d')
    
    this.screenWidth = width
    this.screenHeight = height

    this.squareSize = 20
    
    this.intervalID = null

    this.snake = new Snake(this.squareSize)
    this.fruit = null
    
    this.#keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowRight: 'right',
      ArrowLeft: 'left'
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

  get screenBoundaries() {
    const width = this.screenWidth / this.squareSize - 1
    const height = this.screenHeight / this.squareSize - 1
    return [ width, height ]
  }

  render() {
    this.intervalID = setInterval(() => {
      this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)
      this.drawSnake()
      this.moveSnake()

      this.drawFruit()

      if (this.detectFruitCollision()) {
        this.removeFruit()
        this.growSnake()
      }

      if (
        this.detectWallCollision() ||
        this.detectSelfCollision()
      ) this.stopRender()
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

  drawFruit() {    
    let x, y

    if (this.fruit) {
      x = this.fruit.x
      y = this.fruit.y
    
    } else {
      x = Math.floor(Math.random() * this.screenBoundaries[0] + 1)
      y = Math.floor(Math.random() * this.screenBoundaries[1] + 1)
      
      const snakeBody = this.snake.body
      while (snakeBody.some(part => part.x === x && part.y === y)) {
        x = Math.floor(Math.random() * this.screenBoundaries[0] + 1)
        y = Math.floor(Math.random() * this.screenBoundaries[1] + 1)
      }

      this.fruit = new Fruit(this.squareSize, x, y)
    }
    
    this.context.fillStyle = '#ff0055ff'
    this.context.fillRect(
      x * this.squareSize,
      y * this.squareSize,
      this.squareSize,
      this.squareSize)
  }

  detectFruitCollision() {
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
