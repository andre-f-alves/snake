export default class Snake {
  constructor(squareSize, x=0, y=0) {
    this.squareSize = squareSize

    this.body = [
      { x: x + 2, y: y },
      { x: x + 1, y: y },
      { x: x, y: y }
    ]
    this.head = { ...this.body[0] }

    this.currentDirection = 'Right'
  }

  changeDirection(direction) {
    if (
      (direction === 'Left' && this.currentDirection === 'Right') ||
      (direction === 'Right' && this.currentDirection === 'Left') ||
      (direction === 'Up' && this.currentDirection === 'Down') ||
      (direction === 'Down' && this.currentDirection === 'Up')
    ) return

    this.currentDirection = direction
  }

  move() {
    const direction = this.currentDirection
    const method = `move${direction}`
    this[method]()

    this.body.unshift(this.head)
    this.head = { ...this.body[0] }
    this.body.pop()
  }

  grow() {
    const index = this.body.length - 1
    const tail = { ...this.body[index] }
    this.body.push(tail)
  }

  moveUp() {
    this.head.y -= 1
    // this.head.y = Math.max(0, this.head.y - 1)
  }

  moveDown() {
    this.head.y += 1
    // this.head.y = Math.min(this.screenHeightBoundary, this.head.y + 1)
  }
  
  moveLeft() {
    this.head.x -= 1
    // this.head.x = Math.max(0, this.head.x - 1)
  }
  
  moveRight() {
    this.head.x += 1
    // this.head.x = Math.min(this.screenWidthBoundary, this.head.x + 1)
  }
}
