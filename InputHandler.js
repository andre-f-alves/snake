export default class InputHandler {
  #keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ArrowLeft: 'left'
  }

  constructor(gameInstance) {
    this.gameInstance = gameInstance

    addEventListener('keydown', this.processKey.bind(this))
  }

  processKey(keyDownEvent) {
    const key = keyDownEvent.code
    if (key.startsWith('Arrow')) {
      keyDownEvent.preventDefault()

      const direction = this.#keyMap[key]
      this.gameInstance.enqueueDirection(direction)
    }
  }
}
