export default class Snake {
  #vectors = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: +1 },
    right: { x: +1, y: 0 },
    left: { x: -1, y: 0 }
  }

  #oposite = {
    up: 'down',
    down: 'up',
    right: 'left',
    left: 'right',
  }

  constructor(x, y) {
    this.body = [
      { x: x + 2, y: y },
      { x: x + 1, y: y },
      { x: x, y: y }
    ]

    this.currentDirection = 'right'
  }

  get head() {
    return this.body[0]
  }

  changeDirection(direction) {
    if (this.currentDirection === this.#oposite[direction]) return
    this.currentDirection = direction
  }

  move(grow = false) {
    const newHead = this.getNextMove()
    this.body.unshift(newHead)
    if (!grow) this.body.pop()
  }

  getNextMove() {
    const direction = this.currentDirection
    const vector = this.#vectors[direction]

    return {
      x: this.head.x + vector.x,
      y: this.head.y + vector.y
    }
  }
}
