/* #region ******** IMPORTS ******** */

import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import l0 from './assets/images/levels/l0.png'
import l1 from './assets/images/levels/l1.png'
import l2 from './assets/images/levels/l2.png'
/* #endregion */

/* #region ******** ALIASES & CONVENIENCE ******** */

const $ = document.querySelector.bind(document)

const convertPx = (n) => `${n}px`

/* #endregion */

/* #region ******** CONSTANTS & GLOBAL VARS ******** */
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
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
let bodyWidth = SCREEN_WIDTH

if ((SCREEN_WIDTH / SCREEN_HEIGHT > 12 / 16) || SCREEN_WIDTH > SCREEN_HEIGHT) {
  bodyWidth = SCREEN_HEIGHT * (12 / 16)
}

let raf
let isPlaying = false
let isSpawning = false
let spawningLanes = 0

/* #endregion */

/* #region ******** ELEMENTS ******** */

let canvas
let ctx
let body
let D
let F
let J
let K
let board
let zone
let bassLane
let kickLane
let snareLane
let hihatLane
let fpsEl
let clockEl

/* #endregion */

/* #region ******** AUDIO ******** */

const AudioContext = window.AudioContext || window.webkitAudioContext
const aCtx = new AudioContext()
const bass = new Bass(aCtx)
const kick = new Kick(aCtx)
const snare = new Snare(aCtx)
const hihat = new HiHat(aCtx)

/* #endregion */

/* #region ******** BEATS ******** */

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
  this.parent.element.prepend(this.element)
  this.move = function () {
    this.y += MOVE_SPEED

    if (this.y > BOARD_HEIGHT) {
      // TODO: Generalize all of this. Too much hard-coded bass beats!
      this.parent.beats.pop()
      this.parent.element.removeChild(this.element)
    }
    else {
      this.render()
    }

  }
  this.render = () => {
    this.element.style.top = convertPx(this.y)
  }
}

function spawnBeat(lane) {
  lane.beats.unshift(new BeatSprite(lane))
}

/* #endregion */

/* #region ******** LANES ******** */

const getNewLanesArr = () => ([
  {
    id: 0,
    name: 'bass',
    element: undefined,
    spawning: false,
    instrument: bass,
    play: () => bass.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 1,
    name: 'kick',
    element: undefined,
    spawning: false,
    instrument: kick,
    play: () => kick.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 2,
    name: 'snare',
    element: undefined,
    spawning: false,
    instrument: snare,
    play: () => snare.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 3,
    name: 'hihat',
    element: undefined,
    spawning: false,
    instrument: hihat,
    play: () => hihat.trigger(aCtx.currentTime),
    beats: [],
  },
])
const getNewLanesObj = () => ({
  bass: lanesA[0],
  kick: lanesA[1],
  snare: lanesA[2],
  hihat: lanesA[3],
})
const lanesA = getNewLanesArr()
const lanesO = getNewLanesObj()

function addLaneElements() {
  lanesO.bass.element = bassLane
  lanesO.kick.element = kickLane
  lanesO.snare.element = snareLane
  lanesO.hihat.element = hihatLane
}

/* #endregion */

/* #region ******** LEVELS ******** */

let loadedLevels = 0
let currentLevelNum
let currentLevel
const levels = [l0, l1, l2]

function parseLevels() {
  levels.forEach((lvl) => {
    lvl.data = {}
    lvl.length = lvl.image.width
    lvl.width = lvl.image.width
    lvl.height = lvl.image.height

    ctx.drawImage(lvl.image, 0, 0)

    let processingBeat = 1

    // There will be 5 levels of height. 4 lanes, then metadata.
    for (let i = 0; i < lvl.height; i += 1) {
      lvl.data[i] = []
      let repeats = 0

      // Width is the number of beat `sections`
      // `sections` may repeat n times, specified in the height metadata
      for (let j = 0; j < lvl.width; j += 1) {
        // Process lanes 0 - 3 the same
        const currentResult = ctx.getImageData(j, i, 1, 1).data[0] === 0 ? 1 : ''

        if (i < 4) {
          lvl.data[i].push(currentResult)
        }
        // Process metadata to find repeats
        else {
          const lookahead = ctx.getImageData(j + 1, i, 1, 1).data[0] === 0 ? 1 : ''

          // If there is no result,
          if (!currentResult) {
            lvl.data[i].push(currentResult)
          }
          else if (lookahead && j !== lvl.width - 1) {
            repeats += 1
            lvl.data[i].push('')
          }
          else if (currentResult && (!lookahead || j === lvl.width - 1)) {
            lvl.data[i].push(repeats)
            repeats = 0
          }

          processingBeat += 1
        }
      }
    }
  })
  console.log(levels)
}

function makeLevel(i) {
  const image = new Image()
  const lvl = {
    image,
    id: i,
    length: undefined,
  }

  image.src = levels[i]

  image.onload = function () {
    levels.splice(i, 1, lvl)
    loadedLevels += 1

    if (loadedLevels === levels.length) {
      initGame()
    }
  }
}

/* #endregion */

/* #region ******** GAME LOOP ******** */

let currentTick = TIME_PER_TICK
let totalBeats = 0
let measureBeat = 1
let sectionBeats = 0
let beatsSinceRepeat = 0
let sectionRepeats = 0
let currentRender = 0 // eslint-disable-line

function gameLoop() {
  if (isPlaying) {
  // if (currentTick < ctx.currentTime - TIME_PER_RENDER) {
  //   currentRender += TIME_PER_RENDER
  //   console.log('RENDER', currentRender)
  // }
    if (currentTick < aCtx.currentTime - TIME_PER_TICK) {
    /**
     * PLAY zzfxP song here
     */
      // if (currentRender === 0) {
      //   zzfxP(...songData)

      //   currentRender = 1
      // }

      currentTick += TIME_PER_TICK

      lanesA.forEach((lane) => {
        if (currentLevel.data[lane.id][sectionBeats]) {
          spawnBeat(lane)
        }
      })

      const repeats = currentLevel.data[4][sectionBeats]

      if (repeats) {
        console.log('Found a repeat', repeats, currentLevel.data[4][sectionBeats])
        currentLevel.data[4][sectionBeats] -= 1
        sectionRepeats = currentLevel.data[4][sectionBeats]
        sectionBeats -= beatsSinceRepeat
        beatsSinceRepeat = 0
      }
      else if (repeats === 0) {
        currentLevel.data[4][sectionBeats] = ''
        beatsSinceRepeat = 0
      }
      else {
        beatsSinceRepeat += 1
        sectionBeats += 1

        if (sectionBeats === currentLevel.data[4].length) {
          console.log('SPAWNS COMPLETE!!')
          spawnsComplete()
        }
      }

      // Object.keys(levelData).forEach((key) => {
      //   if (levelData[key][levelIndex] !== null) {
      //     const spawnIn = parseInt(key, 10) === 0 ? bassLane : parseInt(key, 10) === 1 ? kickLane : parseInt(key, 10) === 2 ? snareLane : hihatLane
      //     const spawnType = parseInt(key, 10) === 0 ? bassBeats : parseInt(key, 10) === 1 ? kickBeats : parseInt(key, 10) === 2 ? snareBeats : hihatBeats

      //     spawnBeat(spawnIn, spawnType)
      //   }
      // })

      if (currentTick % (TIME_PER_TICK * 2) === 0) {
      // console.log('Measure event:', MeasureEvents.quarter, currentTick)
      }
      if (currentTick % (TIME_PER_TICK * 4) === 0) {
      // console.log('Measure event:', MeasureEvents.half, currentTick)
      // spawnBeat(bassLane, bassBeats)
      }
      if (currentTick % (TIME_PER_TICK * 8) === 0) {
        // console.log('Measure event:', MeasureEvents.whole, currentTick)
        // if (bassBeats.length < 2) {
        //   spawnBeat(bassLane)
        // }
      }
      if (currentTick % (TIME_PER_TICK * 16) === 0) {
        // console.log('Measure event:', MeasureEvents.whole, currentTick)
        // if (bassBeats.length < 2) {
        //   spawnBeat(bassLane)
        // }
      }

      // Track each measure, 1 - 16
      measureBeat += measureBeat === 16 ? -15 : 1
      totalBeats += 1
    }

    lanesA.forEach((lane) => {
      lane.beats.forEach((beat) => {
        beat.move()
      })

      if (!isSpawning && lane.beats.length === 0 && lane.spawning) {
        lane.spawning = false
        console.log('this lane is done', lane.id, lane.name)
        spawningLanes -= 1
        if (spawningLanes === 0) {
          stopGame()
        }
      }
    })

    // const time = (Math.round(ctx.currentTime * 4) / 4).toFixed(2)
    const time = aCtx.currentTime.toFixed(2)

    clockEl.innerHTML = time

    // Do whatever
    raf = requestAnimationFrame(gameLoop)
  }
}

/* #endregion */

/* #region ******** DEBUG ******** */
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
/* #endregion */

/* #region ******** START ******** */

function setCurrentLevel(lvlNum) {
  currentLevel = levels[lvlNum]
  currentLevelNum = lvlNum
}

function startGame(lvlNum = 0) {
  parseLevels()
  addEventListeners()
  setCurrentLevel(lvlNum)

  isPlaying = true
  isSpawning = true
  lanesA.forEach((lane) => {
    lane.spawning = true
    spawningLanes += 1
  })
  raf = requestAnimationFrame(gameLoop)
}

function stopGame() {
  isPlaying = false
  cancelAnimationFrame(raf)
  console.log('Level Complete!')
}

function spawnsComplete() {
  isSpawning = false
}

/* #endregion */

/* #region ******** INIT ******** */
function initGame() {
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
  startGame(2)
}

function addEventListeners() {
  D.addEventListener('click', (e) => {
    lanesO.bass.play()
  })
  F.addEventListener('click', (e) => {
    lanesO.kick.play()
  })
  J.addEventListener('click', (e) => {
    lanesO.snare.play()
  })
  K.addEventListener('click', (e) => {
    lanesO.hihat.play()
  })

  window.addEventListener('keydown', handleKeyboardControl)
}

function handleKeyboardControl(e) {
  switch (event.code) {
    case 'KeyD':
      lanesO.bass.play()
      // zzfx(...[,0,75,,.05,.5,,,-0.1,,,,,,,,,,.05])
      // zzfx(...[,0,75,,,.5,,,-0.2,.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.75,,,-0.1,,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // checkCollision(bassBeats)
      break
    case 'KeyF':
      lanesO.kick.play()
      // zzfx(...[,0,125,,.05,.25,,2.5,-0.1]) // KICK
      // zzfx(...[,0,110,,,.05,1,.8,-0.2,-0.4,,,,,,,,.5,.29])
      // zzfx(...[,0,115,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,125,,,.5,,,-0.2,-0.1,,,,,,,,.5,.05])
      // checkCollision(kickBeats)
      break
    case 'KeyJ':
      lanesO.snare.play()
      // checkCollision(snareBeats)
      break
    case 'KeyK':
      lanesO.hihat.play()
      // checkCollision(hihatBeats)
      break
    default:
      return
  }
}

window.addEventListener('load', () => {
  canvas = $('#canvas')
  ctx = canvas.getContext('2d')
  body = $('#body')
  D = $('#D')
  F = $('#F')
  J = $('#J')
  K = $('#K')
  board = $('#board')
  zone = $('#zone')
  bassLane = $('#bassLane')
  kickLane = $('#kickLane')
  snareLane = $('#snareLane')
  hihatLane = $('#hihatLane')
  fpsEl = $('#fps')
  clockEl = $('#clock')

  addLaneElements()

  levels.forEach((level, i) => makeLevel(i))

  body.style.width = `${bodyWidth}px`
  body.style.height = `${SCREEN_HEIGHT}px`
})

/* #endregion */
