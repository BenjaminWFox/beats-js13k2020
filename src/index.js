import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import l1 from './assets/images/levels/heartbeat3.png'
import Ticker from './sound/ticker'
import { calcFps } from './util'

const TICK_EVERY = 16
const FPS = 60
const BPM = 120
const TIME_PER_TICK = 60.0 / (TICK_EVERY / 4) / BPM
const TIME_PER_RENDER = TIME_PER_TICK / (TICK_EVERY / 2)
const COUNTS_PER_MEASURE = 16
const SECTION_SIZE = (COUNTS_PER_MEASURE)
let BOARD_HEIGHT
let SECTION_HEIGHT
let ZONE_TOP
let ZONE_CHECK_BOTTOM
let ZONE_CHECK_TOP
let MOVE_SPEED
let ZONE_CHECK_MEH_TOP
let ZONE_CHECK_MEH_BOTTOM
let ZONE_CHECK_OK_TOP
let ZONE_CHECK_OK_BOTTOM
let ZONE_CHECK_GOOD_TOP
let ZONE_CHECK_GOOD_BOTTOM
let ZONE_CHECK_PERFECT_TOP
let ZONE_CHECK_PERFECT_BOTTOM

const MeasureEvents = {
  whole: 'whole',
  half: 'half',
  quarter: 'quarter',
  sixteenth: 'sixteenth',
}

const levelData = {
  0: [],
  1: [],
  2: [],
  3: [],
}

const canvas = document.getElementById('body').appendChild(document.createElement('canvas'))
const cvtx = canvas.getContext('2d')
const level = new Image()
const levelHeight = 4
const levelLength = 176

let isLevelLoaded = false

level.src = l1
level.onload = () => {
  cvtx.drawImage(level, 0, 0)

  for (let i = 0; i < levelHeight; i += 1) {
    for (let j = 0; j < levelLength; j += 1) {
      const result = cvtx.getImageData(j, i, 1, 1).data[0] === 0 ? 0 : null

      console.log(result)

      levelData[i].push(result)
    }
  }
  console.log(levelData[0])
  console.log(levelData[1])

  isLevelLoaded = true
}

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
const bassBeats = []
const kickBeats = []
const snareBeats = []
const hihatBeats = []

const fpsEl = document.getElementById('fps')
const clockEl = document.getElementById('clock')

function BeatSprite(lane) {
  this.parent = lane

  this.y = -SECTION_HEIGHT
  this.width = Math.floor(board.offsetHeight / SECTION_SIZE)
  this.height = this.width

  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(this.width)
  containerEl.style.height = convertPx(this.height)
  containerEl.style.top = convertPx(this.y)

  visualEl.classList.add('beat-visual')

  containerEl.appendChild(visualEl)

  this.element = containerEl
  this.parent.prepend(this.element)
  this.move = function () {
    this.y += MOVE_SPEED

    if (this.y > BOARD_HEIGHT) {
      // TODO: Generalize all of this. Too much hard-coded bass beats!
      bassBeats.pop()
      this.parent.removeChild(this.element)
    }
    else {
      this.render()
    }

  }
  this.render = () => {
    this.element.style.top = convertPx(this.y)
  }
}

function spawnBeat(lane, type) {
  type.unshift(new BeatSprite(lane))
}

let currentTick = TIME_PER_TICK
let measureBeat = 1
let levelIndex = 0
let currentRender = 0 // eslint-disable-line

function gameLoop() {
  // if (currentTick < ctx.currentTime - TIME_PER_RENDER) {
  //   currentRender += TIME_PER_RENDER
  //   console.log('RENDER', currentRender)
  // }
  if (currentTick < ctx.currentTime - TIME_PER_TICK) {
    currentTick += TIME_PER_TICK

    Object.keys(levelData).forEach((key) => {
      if (levelData[key][levelIndex] !== null) {
        const spawnIn = parseInt(key, 10) === 0 ? bassLane : parseInt(key, 10) === 1 ? kickLane : parseInt(key, 10) === 2 ? snareLane : hihatLane
        const spawnType = parseInt(key, 10) === 0 ? bassBeats : parseInt(key, 10) === 1 ? kickBeats : parseInt(key, 10) === 2 ? snareBeats : hihatBeats

        spawnBeat(spawnIn, spawnType)
      }
    })

    if (currentTick % (TIME_PER_TICK * 2) === 0) {
      // console.log('Measure event:', MeasureEvents.quarter, currentTick)
    }
    if (currentTick % (TIME_PER_TICK * 4) === 0) {
      // console.log('Measure event:', MeasureEvents.half, currentTick)
    }
    if (currentTick % (TIME_PER_TICK * 8) === 0) {
      // console.log('Measure event:', MeasureEvents.whole, currentTick)
      // if (bassBeats.length < 2) {
      //   spawnBeat(bassLane)
      // }
    }

    measureBeat += measureBeat === 16 ? -15 : 1
    levelIndex += 1
    if (levelIndex === levelData[0].length) {
      levelIndex -= 17
    }
  }

  bassBeats.forEach((beat) => {
    // console.log('beat/zone', beat.style.top, zone.style.top)
    beat.move()
  })
  kickBeats.forEach((beat) => {
    // console.log('beat/zone', beat.style.top, zone.style.top)
    beat.move()
  })

  // const time = (Math.round(ctx.currentTime * 4) / 4).toFixed(2)
  const time = ctx.currentTime.toFixed(2)

  clockEl.innerHTML = time

  // Do whatever
  requestAnimationFrame(gameLoop)
}

function start() {
  if (isLevelLoaded) {
    console.log('starting...')
    requestAnimationFrame(gameLoop)
  }
  else {
    console.log('loading...')
    setTimeout(start, .5)
  }
}
start()

function checkCollision(laneArr) {
  for (let i = laneArr.length; i > 0; i -= 1) {
    const sI = i - 1
    const sprite = laneArr[sI]
    const sY = Math.floor(sprite.y)

    if (sY >= ZONE_CHECK_BOTTOM) {
      console.log('index', sI, 'too late')
      continue
    }
    if (sY <= ZONE_CHECK_TOP) {
      console.log('index', sI, 'too soon')
      continue
    }
    if (sY < ZONE_CHECK_PERFECT_BOTTOM && sprite.y > ZONE_CHECK_PERFECT_TOP) {
      console.log('... PERFECT ...')
      continue
    }
    if (sY < ZONE_CHECK_GOOD_BOTTOM && sprite.y > ZONE_CHECK_GOOD_TOP) {
      console.log('... GOOD ...')
      continue
    }
    if (sY < ZONE_CHECK_OK_BOTTOM && sprite.y > ZONE_CHECK_OK_TOP) {
      console.log('... OK ...')
      continue
    }
    if (sY < ZONE_CHECK_BOTTOM && sprite.y > ZONE_CHECK_TOP) {
      console.log('... MEH ...')
      continue
    }

    console.log('Unaccounded for situation', sI)
    console.log(sY)
    console.log(ZONE_CHECK_TOP)
    console.log(ZONE_CHECK_BOTTOM)
    console.log(ZONE_CHECK_MEH_TOP)
    console.log(ZONE_CHECK_MEH_BOTTOM)
    console.log(ZONE_CHECK_OK_TOP)
    console.log(ZONE_CHECK_OK_BOTTOM)
    console.log(ZONE_CHECK_GOOD_TOP)
    console.log(ZONE_CHECK_GOOD_BOTTOM)
    console.log(ZONE_CHECK_PERFECT_TOP)
    console.log(ZONE_CHECK_PERFECT_BOTTOM)
    // if (sprite.y < )
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

function makeBeat(lane) {
  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE))
  containerEl.style.height = containerEl.style.width
  containerEl.style.top = convertPx(Math.floor(board.offsetHeight / SECTION_SIZE) * (SECTION_SIZE - 2))

  visualEl.classList.add('beat-visual')
  containerEl.appendChild(visualEl)

  const beat = new BeatSprite(
    convertPx(Math.floor(board.offsetHeight / SECTION_SIZE) * (SECTION_SIZE - 2)),
    convertPx(Math.floor(board.offsetHeight / SECTION_SIZE)),
    containerEl,
    lane,
  )

  return beat
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

function createDebugZones(zoneArr) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue']

  zoneArr.forEach(([top, bottom], i) => {
    const el = document.createElement('div')

    el.style.position = 'absolute'
    el.style.width = '4px'
    el.style.backgroundColor = colors[i]
    el.style.top = convertPx(top)
    el.style.left = convertPx(50 + (4 * (i + 1)))
    el.style.height = convertPx(bottom - top)

    board.appendChild(el)
  })
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
  ZONE_TOP = Math.floor(BOARD_HEIGHT / SECTION_SIZE) * (SECTION_SIZE - 2)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)

  ZONE_CHECK_TOP = ZONE_TOP - SECTION_HEIGHT
  ZONE_CHECK_BOTTOM = SECTION_HEIGHT * 15
  // ZONE_CHECK_MEH_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  // ZONE_CHECK_MEH_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_GOOD_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 2.5)))
  ZONE_CHECK_GOOD_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 2.5)))
  ZONE_CHECK_PERFECT_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 5)))
  ZONE_CHECK_PERFECT_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 5)))

  createDebugZones([
    [ZONE_CHECK_TOP, ZONE_CHECK_BOTTOM],
    // [ZONE_CHECK_MEH_TOP, ZONE_CHECK_MEH_BOTTOM],
    [ZONE_CHECK_OK_TOP, ZONE_CHECK_OK_BOTTOM],
    [ZONE_CHECK_GOOD_TOP, ZONE_CHECK_GOOD_BOTTOM],
    [ZONE_CHECK_PERFECT_TOP, ZONE_CHECK_PERFECT_BOTTOM],
  ])

  renderRows()

  board.style.height = convertPx(BOARD_HEIGHT)
  zone.style.height = convertPx(SECTION_HEIGHT)

  // Create the 'hit' zone one 'section' above the boattom of the board
  zone.style.top = convertPx(ZONE_TOP)

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

  // console.log('Creating new ticker')
  // ticker = new Ticker(ctx, onTick, onUpdate)
  // ticker.start()
})

/**
 * ******** CONTORLS ********
 */
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
      checkCollision(bassBeats)
      break
    case 'KeyF':
      kick.trigger(ctx.currentTime)
      checkCollision(kickBeats)
      break
    case 'KeyJ':
      snare.trigger(ctx.currentTime)
      checkCollision(snareBeats)
      break
    case 'KeyK':
      hihat.trigger(ctx.currentTime)
      checkCollision(hihatBeats)
      break
    default:
      return
  }
}
