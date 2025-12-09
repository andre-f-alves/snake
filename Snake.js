export default class Snake {
  #moves

  constructor(context, x, y, width, height, displacementFactor) {
    this.context = context
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    const contextWidth = this.context.canvas.width
    const contextHeight = this.context.canvas.height

    this.displacementFactor = displacementFactor

    this.#moves = {
      ArrowUp: () => {
        if (this.y === 0) return
        this.y -= this.displacementFactor
      },

      ArrowDown: () => {
        if ((this.y + this.height) >= contextHeight) return
        this.y += this.displacementFactor
      },
      
      ArrowLeft: () => {
        if (this.x === 0) return
        this.x -= this.displacementFactor
      },
      
      ArrowRight: () => {
        if ((this.x + this.width) >= contextWidth) return
        this.x += this.displacementFactor
      },
    }
  }

  draw() {
    this.context.save()
    this.context.fillStyle = '#06b100ff'
    this.context.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.context.restore()
  }

  move(key) {
    this.#moves[key]()
    this.draw()
  }
}
