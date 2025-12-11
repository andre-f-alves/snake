export default class Snake {

  constructor(context, squareSize, x=0, y=0) {
    this.context = context
    this.squareSize = squareSize

    this.body = [
      {x: x + 2, y: y},
      {x: x + 1, y: y},
      {x: x, y: y}
    ]
    this.head = { ...this.body[0] }
  }

  get widthBoundary() {
    return (this.context.canvas.width / this.squareSize) - 1
  }

  get heightBoundary() {
    return (this.context.canvas.height / this.squareSize) - 1
  }

  draw() {
    const headColor = '#06b100ff'
    const bodyColor = '#07da00ff'
    this.body.forEach((part, i) => {
      this.context.fillStyle = i === 0 ? headColor : bodyColor
      this.context.fillRect(
        part.x * this.squareSize,
        part.y * this.squareSize,
        this.squareSize,
        this.squareSize
      )
    })
  }

  move(direction) {
    this[direction]()
    this.body.unshift(this.head)
    this.head = { ...this.body[0] }
    this.body.pop()

    this.draw()
  }

  grow() {
    const index = this.body.length - 1
    const tail = { ...this.body[index] }
    this.body.push(tail)
  }

  moveUp() {
    this.head.y = Math.max(0, this.head.y - 1)
  }

  moveDown() {
    this.head.y = Math.min(this.head.y + 1, this.heightBoundary)
  }
  
  moveLeft() {
    this.head.x = Math.max(0, this.head.x - 1)
  }
  
  moveRight() {
    this.head.x = Math.min(this.head.x + 1, this.widthBoundary)
  }
}
