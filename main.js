import Game from './Game.js'

const screen = document.getElementById('screen')
const game = new Game(screen, 600, 600)

game.render()

addEventListener('keydown', (e) => {
  const key = e.code
  // console.log(e)
  if (key.startsWith('Arrow')) {
    e.preventDefault()
    game.changeSnakeDirection(key)
  }
})
