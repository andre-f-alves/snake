export default class Renderer {
  constructor(screen, squareSize) {
    this.screen = screen
    this.context = screen.getContext('2d')
    this.squareSize = squareSize
  }

  get screenWidth() {
    return this.screen.width
  }

  get screenHeight() {
    return this.screen.height
  }

  renderSnake(snake, headColor, bodyColor) {
    const snakeBody = snake.body

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

  renderFruit(fruit, color) {
    this.context.fillStyle = color
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
