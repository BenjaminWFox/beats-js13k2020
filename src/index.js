/* #region ******** IMPORTS ******** */

import './main.scss'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import l0 from './assets/images/levels/l0.png'
import l1 from './assets/images/levels/l1.png'
import l2 from './assets/images/levels/l2.png'
import l3 from './assets/images/levels/l3.png'
import l4 from './assets/images/levels/l4.png'
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
let ZONE_HEIGHT
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
let boardWrapper
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

/* eslint-disable */
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx = (...t) => zzfxP(zzfxG(...t))
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP = (...t) => { let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR); t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start(); return e }
// zzfxG() - the sound generator -- returns an array of sample data
const zzfxG = (a = 1, t = .05, h = 220, M = 0, n = 0, s = .1, i = 0, r = 1, o = 0, z = 0, e = 0, f = 0, m = 0, x = 0, b = 0, d = 0, u = 0, c = 1, G = 0, I = zzfxR, P = 99 + M * I, V = n * I, g = s * I, j = G * I, k = u * I, l = 2 * Math.PI, p = (a => 0 < a ? 1 : -1), q = P + j + V + g + k, v = (o *= 500 * l / I ** 2), w = (h *= (1 + 2 * t * Math.random() - t) * l / I), y = p(b) * l / 4, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, H = 1, J = []) => { for (; C < q; J[C++] = F)++E > 100 * d && (E = 0, F = A * h * Math.sin(B * b * l / I - y), F = p(F = i ? 1 < i ? 2 < i ? 3 < i ? Math.sin((F % l) ** 3) : Math.max(Math.min(Math.tan(F), 1), -1) : 1 - (2 * F / l % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(F / l) - F / l) : Math.sin(F)) * Math.abs(F) ** r * a * zzfxV * (C < P ? C / P : C < P + j ? 1 - (C - P) / j * (1 - c) : C < P + j + V ? c : C < q - k ? (q - C - k) / g * c : 0), F = k ? F / 2 + (k > C ? 0 : (C < q - k ? 1 : (C - q) / k) * J[C - k | 0] / 2) : F), A += 1 - x + 1e9 * (Math.sin(C) + 1) % 2 * x, B += 1 - x + 1e9 * (Math.sin(C) ** 2 + 1) % 2 * x, h += o += 500 * z * l / I ** 3, H && ++H > f * I && (h += e * l / I, w += e * l / I, H = 0), m && ++D > m * I && (h = w, o = v, D = 1, H = H || 1); return J };
// zzfxV - global volume
const zzfxV = .3
// zzfxR - global sample rate
const zzfxR = 44100
// zzfxX - the common audio context
const zzfxX = aCtx
//! ZzFXM (v2.0.2) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
const zzfxM = (f, n, o, t = 125) => { let z, e, l, r, g, h, x, a, u, c, d, i, m, p, G, M, R = [], b = [], j = [], k = 0, q = 1, s = {}, v = zzfxR / t * 60 >> 2; for (; q; k++)R = [q = a = d = m = 0], o.map((t, d) => { for (x = n[t][k] || [0, 0, 0], q |= !!n[t][k], G = m + (n[t][0].length - 2 - !a) * v, e = 2, r = m; e < x.length + (d == o.length - 1); a = ++e) { for (g = x[e], u = c != (x[0] || 0) | g | 0, l = 0; l < v && a; l++ > v - 99 && u ? i += (i < 1) / 99 : 0)h = (1 - i) * R[p++] / 2 || 0, b[r] = (b[r] || 0) + h * M - h, j[r] = (j[r++] || 0) + h * M + h; g && (i = g % 1, M = x[1] || 0, (g |= 0) && (R = s[[c = x[p = 0] || 0, g]] = s[[c, g]] || (z = [...f[c]], z[2] *= 2 ** ((g - 12) / 12), zzfxG(...z)))) } m = G }); return [b, j] }


const getSong = () => (
  [
  [
    [1, 0, 50],
    [1, 0, 100],
    [1, 0, 150],
    [1, 0, 200],
    [1, 0, 250],
    [1, 0, 300],
    [1, 0, 350],
    [1, 0, 400],
  ],
  [
    [
      [7, 0, ,,, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      [3, 0, ,,, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
      // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
    ],
    [
      [7, 0, 19, 19, 23, 19, 26, 19, 26, 24, 17, 17, 21, 17, 24, 17, 24, 23],
      [7, 0, 0, 7, 7, 11, 7, 14, 7, 14, 12, 5, 5, 9, 5, 12, 5, 12, 11],
      // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      // [5, 0, 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18, 14],
      // [4, 0, , 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18],
    ],
    [
      [7, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      [3, 0, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
      // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
    ],
  ],
  [
    0,
    1,
  ],
  60,
])
let song
let songData
/* eslint-enable */

/* #endregion */

/* #region ******** BEATS ******** */

function BeatSprite(lane) {
  this.parent = lane

  this.y = -SECTION_HEIGHT
  this.width = Math.floor(board.offsetHeight / SECTION_SIZE)
  this.height = this.width
  this.played = false

  const containerEl = document.createElement('div')
  const visualEl = document.createElement('div')

  containerEl.classList.add('beat-container')
  containerEl.style.width = convertPx(this.width)
  containerEl.style.height = convertPx(this.height)
  containerEl.style.top = convertPx(this.y)

  visualEl.classList.add('beat-visual')
  visualEl.classList.add(`${this.parent.name}-beat`)

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
    // if (!this.played && this.y > ZONE_TOP) {
    //   this.parent.play()
    //   this.played = true
    // }
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
    color: 'purple',
    element: undefined,
    spawning: false,
    instrument: bass,
    play: () => bass.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 1,
    name: 'kick',
    color: 'blue',
    element: undefined,
    spawning: false,
    instrument: kick,
    play: () => kick.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 2,
    name: 'snare',
    color: 'yellow',
    element: undefined,
    spawning: false,
    instrument: snare,
    play: () => snare.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 3,
    name: 'hihat',
    color: 'red',
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

/* #region ******** COLLISION ******** */

function checkCollision(lane) {
  for (let i = lane.beats.length; i > 0; i -= 1) {
    const sI = i - 1
    const sprite = lane.beats[sI]
    const sY = Math.floor(sprite.y)

    if (sY >= ZONE_CHECK_BOTTOM) {
      // console.log('index', sI, 'too late')
      continue
    }
    if (sY <= ZONE_CHECK_TOP) {
      // console.log('index', sI, 'too soon')
      continue
    }
    if (sY < ZONE_CHECK_PERFECT_BOTTOM && sprite.y > ZONE_CHECK_PERFECT_TOP) {
      // console.log('... PERFECT ...')
      continue
    }
    if (sY < ZONE_CHECK_GOOD_BOTTOM && sprite.y > ZONE_CHECK_GOOD_TOP) {
      // console.log('... GOOD ...')
      continue
    }
    if (sY < ZONE_CHECK_OK_BOTTOM && sprite.y > ZONE_CHECK_OK_TOP) {
      // console.log('... OK ...')
      continue
    }
    if (sY < ZONE_CHECK_BOTTOM && sprite.y > ZONE_CHECK_TOP) {
      // console.log('... MEH ...')
      continue
    }

    // console.log('Unaccounded for situation', sI)
    // console.log(sY)
    // console.log(ZONE_CHECK_TOP)
    // console.log(ZONE_CHECK_BOTTOM)
    // console.log(ZONE_CHECK_MEH_TOP)
    // console.log(ZONE_CHECK_MEH_BOTTOM)
    // console.log(ZONE_CHECK_OK_TOP)
    // console.log(ZONE_CHECK_OK_BOTTOM)
    // console.log(ZONE_CHECK_GOOD_TOP)
    // console.log(ZONE_CHECK_GOOD_BOTTOM)
    // console.log(ZONE_CHECK_PERFECT_TOP)
    // console.log(ZONE_CHECK_PERFECT_BOTTOM)
  }
}

/* #endregion */

/* #region ******** LEVELS ******** */

let loadedLevels = 0
let currentLevelNum
let currentLevel
const levels = [l0, l1, l2, l3, l4]

function parseLevels() {
  levels.forEach((lvl, i) => {
    lvl.data = {}
    lvl.length = lvl.image.width
    lvl.width = lvl.image.width
    lvl.height = lvl.image.height
    ctx.drawImage(lvl.image, 0, 0)

    let processingBeat = 1
    let totalMeasures = 0

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
            totalMeasures += 1
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

    lvl.songRepeats = Math.ceil(totalMeasures / 2)

    console.log('Level repeats', i, lvl.songRepeats)

  })
  console.log('Levels complete', levels)
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
      if (currentRender === 0) {
        zzfxP(...songData)

        currentRender = 1
      }

      currentTick += TIME_PER_TICK

      for (let i = 0; i < lanesA.length; i += 1) {
        if (currentLevel.data[lanesA[i].id][sectionBeats]) {
          spawnBeat(lanesA[i])
        }
      }

      const repeats = currentLevel.data[4][sectionBeats]

      if (repeats) {
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
          // console.log('SPAWNS COMPLETE!!')
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

    for (let i = 0; i < lanesA.length; i += 1) {
      for (let j = 0; j < lanesA[i].beats.length; j += 1) {
        lanesA[i].beats[j].move()
      }

      if (!isSpawning && lanesA[i].beats.length === 0 && lanesA[i].spawning) {
        lanesA[i].spawning = false
        console.log('this lane is done', lanesA[i].id, lanesA[i].name)
        spawningLanes -= 1
        if (spawningLanes === 0) {
          stopGame()
        }
      }
    }

    // // const time = (Math.round(ctx.currentTime * 4) / 4).toFixed(2)
    // const time = aCtx.currentTime.toFixed(2)

    // clockEl.innerHTML = time

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

function startLevel(lvlNum = 0) {
  setCurrentLevel(lvlNum)
  song = getSong()
  for (let i = 0; i < currentLevel.songRepeats; i += 1) {
    song[2].push(2)
    song[2].push(1)
  }
  console.log(song)
  songData = zzfxM(...song)

  isPlaying = true
  isSpawning = true
  lanesA.forEach((lane) => {
    lane.spawning = true
    spawningLanes += 1
  })
  raf = requestAnimationFrame(gameLoop)
}

function startGame(lvlNum = 0) {
  parseLevels()
  addEventListeners()
  startLevel(lvlNum)
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
  BOARD_HEIGHT = boardWrapper.offsetHeight
  SECTION_HEIGHT = Math.floor(boardWrapper.offsetHeight / SECTION_SIZE)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)

  ZONE_HEIGHT = SECTION_HEIGHT * 1.5

  ZONE_TOP = Math.floor(BOARD_HEIGHT / SECTION_SIZE) * (SECTION_SIZE - 2)
  ZONE_CHECK_TOP = ZONE_TOP - SECTION_HEIGHT
  ZONE_CHECK_BOTTOM = (SECTION_HEIGHT * 15) + (SECTION_HEIGHT / 2)
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

  // DEBUG render horizontal rows
  // renderRows()

  board.style.height = convertPx(BOARD_HEIGHT)
  boardWrapper.style.height = convertPx(BOARD_HEIGHT)
  zone.style.height = convertPx(ZONE_HEIGHT)

  // Create the 'hit' zone one 'section' above the boattom of the board
  zone.style.top = convertPx(ZONE_TOP)

  /* START GAME */
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
      checkCollision(lanesO.bass)
      break
    case 'KeyF':
      lanesO.kick.play()
      // zzfx(...[,0,125,,.05,.25,,2.5,-0.1]) // KICK
      // zzfx(...[,0,110,,,.05,1,.8,-0.2,-0.4,,,,,,,,.5,.29])
      // zzfx(...[,0,115,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,125,,,.5,,,-0.2,-0.1,,,,,,,,.5,.05])
      checkCollision(lanesO.kick)
      break
    case 'KeyJ':
      lanesO.snare.play()
      checkCollision(lanesO.snare)
      break
    case 'KeyK':
      lanesO.hihat.play()
      checkCollision(lanesO.hihat)
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
  boardWrapper = $('#board-wrapper')
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
