export default class Snake {
  #vectors
  #oposite

  constructor(squareSize, x=0, y=0) {
    this.squareSize = squareSize

    this.body = [
      { x: x + 2, y: y },
      { x: x + 1, y: y },
      { x: x, y: y }
    ]

    this.currentDirection = 'right'

    this.#vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: +1 },
      right: { x: +1, y: 0 },
      left: { x: -1, y: 0 }
    }

    this.#oposite = {
      up: 'down',
      down: 'up',
      right: 'left',
      left: 'right',
    }
  }

  get head() {
    return this.body[0]
  }

  changeDirection(direction) {
    if (this.currentDirection === this.#oposite[direction]) return

    this.currentDirection = direction
  }

  move() {
    const direction = this.currentDirection
    const vector = this.#vectors[direction]

    const newHead = {
      x: this.head.x + vector.x,
      y: this.head.y + vector.y
    }

    this.body.unshift(newHead)
    this.body.pop()
  }

  grow() {
    const index = this.body.length - 1
    const tail = { ...this.body[index] }
    this.body.push(tail)
  }
}
