export default class InputHandler {
  #keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ArrowLeft: 'left'
  }

  constructor(gameInstance) {
    this.gameInstance = gameInstance

    this.touchPoint = null
    this.lastDirection = null

    addEventListener('keydown', this.processKey.bind(this))

    this.screen.addEventListener('touchstart', this.processTouchStart.bind(this))

    this.screen.addEventListener('touchend', this.processTouchEnd.bind(this))

    this.screen.addEventListener('touchmove', this.processTouchMove.bind(this))
  }

  get screen() {
    return this.gameInstance.screen
  }

  reset() {
    this.lastDirection = null
  }

  processKey(keyDownEvent) {
    const key = keyDownEvent.code
    if (key.startsWith('Arrow')) {
      keyDownEvent.preventDefault()

      const direction = this.#keyMap[key]
      this.gameInstance.enqueueDirection(direction)
    }
  }

  processTouchStart(touchEvent) {
    touchEvent.preventDefault()
    const touch = touchEvent.changedTouches.item(0)
    const rect = this.screen.getBoundingClientRect()
    this.touchPoint = {
      x: Math.floor(touch.clientX - rect.left),
      y: Math.floor(touch.clientY - rect.top)
    }
  }

  processTouchEnd(touchEvent) {
    touchEvent.preventDefault()
    this.touchPoint = null
  }

  processTouchMove(touchEvent) {
    touchEvent.preventDefault()
    const changedTouch = touchEvent.changedTouches.item(0)
    const rect = this.screen.getBoundingClientRect()
    
    const touch = {
      x: Math.floor(changedTouch.clientX - rect.left),
      y: Math.floor(changedTouch.clientY - rect.top)
    }

    if (!this.touchPoint) {
      this.touchPoint = touch
      return
    }

    const dx = touch.x - this.touchPoint.x
    const dy = touch.y - this.touchPoint.y
    
    const deadzone = 8
    if (
      Math.abs(dx) < deadzone &&
      Math.abs(dy) < deadzone
    ) {
      this.touchPoint = touch
      return
    }

    this.touchPoint = touch
    if (dx === 0 && dy === 0) return
    
    let direction = null
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left'
    } else {
      direction = dy > 0 ? 'down' : 'up'
    }
    
    if (direction === this.lastDirection) return

    if (!this.lastDirection) this.lastDirection = direction

    this.gameInstance.enqueueDirection(direction)
    this.lastDirection = direction
  }
}
