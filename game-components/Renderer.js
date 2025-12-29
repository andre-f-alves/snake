export default class Renderer {
  constructor(screen, screenConfig) {
    this.screen = screen
    this.screenWidth = screenConfig.width
    this.screenHeight = screenConfig.height
    this.squareSize = screenConfig.squareSize

    this.context = screen.getContext('2d')

    this.colors = {
      snakeHead: '#06b100ff',
      snakeBody: '#07da00ff',
      selfCollision: '#3aff33ff',
      fruit: '#ff0055ff'
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
    return [width, height]
  }

  renderSnake(snake, selfCollisionPoint = null) {
    const snakeBody = snake.body

    const headColor = this.colors.snakeHead
    const bodyColor = this.colors.snakeBody

    snakeBody.forEach((part, i) => {
      if (
        selfCollisionPoint &&
        part.x === selfCollisionPoint.x &&
        part.y === selfCollisionPoint.y
      ) {
        this.context.fillStyle = this.colors.selfCollision
        
      } else {
        this.context.fillStyle = i === 0 ? headColor : bodyColor
      }

      this.context.fillRect(
        part.x * this.squareSize,
        part.y * this.squareSize,
        this.squareSize,
        this.squareSize
      )
    })
  }

  renderSnakeCollisionPoint(collisionPoint) {
    this.context.fillStyle = this.colors.selfCollision
    this.context.fillRect(
      collisionPoint.x * this.squareSize,
      collisionPoint.y * this.squareSize,
      this.squareSize,
      this.squareSize
    )    
  }

  renderFruit(fruit) {
    this.context.fillStyle = this.colors.fruit
    this.context.fillRect(
      fruit.x * this.squareSize,
      fruit.y * this.squareSize,
      this.squareSize,
      this.squareSize
    )
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.screenWidth, this.screenHeight)
  }
}
