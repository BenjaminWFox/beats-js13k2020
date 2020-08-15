import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'

const AudioContext = window.AudioContext || window.webkitAudioContext
const ctx = new AudioContext()
const bass = new Bass(ctx)
const kick = new Kick(ctx)
const snare = new Snare(ctx)
const hihat = new HiHat(ctx)

const D = document.getElementById('D')
const F = document.getElementById('F')
const J = document.getElementById('J')
const K = document.getElementById('K')

let board
let zone
let bassLane
let kickLane
let snareLane
let hihatLane

const timeEl = document.getElementById('time')
let time = 0

function gameLoop() {
  time += 1
  timeEl.innerHTML = ctx.currentTime

  if (time % 100 === 0) {
    // console.log('Fire')
    // playBass()
  }

  // Do whatever
  requestAnimationFrame(gameLoop)
}

// requestAnimationFrame(gameLoop)

D.addEventListener('click', (e) => {
  bass.trigger(ctx.currentTime)
})
F.addEventListener('click', (e) => {
  kick.trigger(ctx.currentTime)
})
J.addEventListener('click', (e) => {
  snare.trigger(ctx.currentTime)
})
K.addEventListener('click', (e) => {
  hihat.trigger(ctx.currentTime)
})

// D.addEventListener('touchend', (e) => {
//   bass.trigger(ctx.currentTime)
// })
// F.addEventListener('touchend', (e) => {
//   kick.trigger(ctx.currentTime)
// })
// J.addEventListener('touchend', (e) => {
//   snare.trigger(ctx.currentTime)
// })
// K.addEventListener('touchend', (e) => {
//   hihat.trigger(ctx.currentTime)
// })

function handleKeyboardControl(e) {
  switch (event.code) {
    case 'KeyD':
      console.log(event.code)
      bass.trigger(ctx.currentTime)
      break
    case 'KeyF':
      console.log(event.code)
      kick.trigger(ctx.currentTime)
      break
    case 'KeyJ':
      console.log(event.code)
      snare.trigger(ctx.currentTime)
      break
    case 'KeyK':
      console.log(event.code)
      // hihat2(ctx)
      hihat.trigger(ctx.currentTime)
      break
    default:
      return
  }
}

const body = document.getElementById('body')
// const synthWrapper = document.getElementById('synth-wrapper')
// const synthHeader = document.getElementById('synth-header')
// const gameWrapper = document.getElementById('game-wrapper')

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
let bodyWidth = SCREEN_WIDTH

if ((SCREEN_WIDTH / SCREEN_HEIGHT > 12 / 16) || SCREEN_WIDTH > SCREEN_HEIGHT) {
  bodyWidth = SCREEN_HEIGHT * (12 / 16)
}
const convertPx = (n) => `${n}px`
const makeBeat = () => {
  const el = document.createElement('div')

  el.classList.add('beat')
  el.style.width = convertPx(board.offsetHeight / 10)
  el.style.height = el.style.width

  console.log(zone.style.height)

  return el
}
const initGame = () => {
  board = document.getElementById('game-wrapper')
  zone = document.getElementById('zone')
  bassLane = document.getElementById('bass')
  kickLane = document.getElementById('kick')
  snareLane = document.getElementById('snare')
  hihatLane = document.getElementById('hihat')

  console.log(board.offsetHeight)
  board.style.height = convertPx(board.offsetHeight / 10)
  zone.style.height = board.style.height

  // bassLane.appendChild(makeBeat())
  bassLane.prepend(makeBeat())
}

window.addEventListener('load', () => {
  console.log('-- window _ load --')

  window.addEventListener('keydown', handleKeyboardControl)

  body.style.width = `${bodyWidth}px`
  body.style.height = `${SCREEN_HEIGHT}px`

  initGame()
})
