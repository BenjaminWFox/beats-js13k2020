import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import Ticker from './sound/ticker'

let ticker

const TICK_EVERY = 16
const FPS = 60
const BPM = 120
const TIME_PER_TICK = 60.0 / (TICK_EVERY / 4) / BPM
const COUNTS_PER_MEASURE = 16
const SECTION_SIZE = (COUNTS_PER_MEASURE)
let BOARD_HEIGHT
let SECTION_HEIGHT
let MOVE_SPEED

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
const fpsEl = document.getElementById('fps')
const beats = []

const clockEl = document.getElementById('clock')

function onUpdate() {
}

function onTick(totalTicks) {
  if (totalTicks % 4 === 0 && totalTicks !== 0) {
    spawnBeat(bassLane)
  }
}

let lastCalledTime
let fps
let delta

function gameLoop() {
  // console.log(Math.round(performance.now()))

  /**
   * calc fps
   */
  if (!lastCalledTime) {
    console.log('fps')
    lastCalledTime = performance.now()

    fps = 0
  }
  else {
    delta = (performance.now() - lastCalledTime) / 1000

    lastCalledTime = performance.now()

    fps = Math.round((1 / delta))
    fpsEl.innerHTML = fps
  }

  beats.forEach((beat) => {
    // console.log('beat/zone', beat.style.top, zone.style.top)
    beat.style.top = convertPx(parseInt(beat.style.top, 10) + MOVE_SPEED)
  })

  // const time = (Math.round(ctx.currentTime * 4) / 4).toFixed(2)
  const time = ctx.currentTime.toFixed(2)

  clockEl.innerHTML = time

  // Do whatever
  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

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

// Will be required for touch events on mobile:
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
      bass.trigger(ctx.currentTime)
      checkCollision(bassLane)
      break
    case 'KeyF':
      kick.trigger(ctx.currentTime)
      checkCollision(kickLane)
      break
    case 'KeyJ':
      snare.trigger(ctx.currentTime)
      checkCollision(snareLane)
      break
    case 'KeyK':
      hihat.trigger(ctx.currentTime)
      checkCollision(hihatLane)
      break
    default:
      return
  }
}

function checkCollision(laneEl) {
  const children = laneEl.children

  // for (let i = children.length; i < children.length - 3; i -= 1) {

  // }
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

const spawnBeat = (lane) => {
  const beat = makeBeat()

  beat.style.top = convertPx(0 - SECTION_HEIGHT)
  lane.prepend(beat)
  beats.push(beat)
}

const makeBeat = () => {
  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE))
  containerEl.style.height = containerEl.style.width
  containerEl.style.top = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE) * (SECTION_SIZE - 2))

  visualEl.classList.add('beat-visual')
  containerEl.appendChild(visualEl)

  return containerEl
}

const renderRows = () => {
  for (let i = 0; i < COUNTS_PER_MEASURE; i += 1) {
    const el = document.createElement('div')

    el.style.position = 'absolute'
    el.style.width = '100%'
    el.style.height = convertPx(SECTION_HEIGHT)
    el.style.top = convertPx(SECTION_HEIGHT * i)
    el.style.backgroundColor = i % 2 === 0 ? 'rgba(255, 255, 255, .1)' : 'rgba(255, 255, 255, .05)'

    board.appendChild(el)
  }
}

const initGame = () => {
  board = document.getElementById('game-wrapper')
  zone = document.getElementById('zone')
  bassLane = document.getElementById('bass')
  kickLane = document.getElementById('kick')
  snareLane = document.getElementById('snare')
  hihatLane = document.getElementById('hihat')

  BOARD_HEIGHT = board.offsetHeight
  SECTION_HEIGHT = Math.floor(board.offsetHeight / SECTION_SIZE)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)

  renderRows()

  board.style.height = convertPx(BOARD_HEIGHT)
  zone.style.height = convertPx(SECTION_HEIGHT)

  // Create the 'hit' zone one 'section' above the boattom of the board
  zone.style.top = convertPx(Math.floor(BOARD_HEIGHT / SECTION_SIZE) * (SECTION_SIZE - 2))

  // bassLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // kickLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // snareLane.style.top = convertPx(0 - SECTION_HEIGHT)
  // hihatLane.style.top = convertPx(0 - SECTION_HEIGHT)

  // lanes.style.top = convertPx(0 - SECTION_HEIGHT)

  // bassLane.appendChild(makeBeat())
  // spawnBeat(bassLane)
}

window.addEventListener('load', () => {
  console.log('-- window _ load -- ddd')

  window.addEventListener('keydown', handleKeyboardControl)

  body.style.width = `${bodyWidth}px`
  body.style.height = `${SCREEN_HEIGHT}px`

  initGame()

  console.log('Creating new ticker')
  ticker = new Ticker(ctx, onTick, onUpdate)
  ticker.start()
})
