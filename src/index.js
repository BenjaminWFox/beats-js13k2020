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
import l5 from './assets/images/levels/l5.png'
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
let BOARD_WIDTH
let SECTION_HEIGHT
let LANE_WIDTH
let BOARD_MID
let HALF_SECTION
let ZONE_HEIGHT
let ZONE_TOP
let ZONE_CHECK_BOTTOM
let ZONE_CHECK_TOP
let MOVE_SPEED
let MOVE_SPEED_SMOOTH
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
let bassX
let kickX
let snareX
let hihatX
const result = {
  perfect: undefined,
  good: undefined,
  ok: undefined,
  meh: undefined,
  bad: undefined,
}

function logValues() {
  console.log('*** Values ***')
  console.log(' - TIME_PER_TICK', TIME_PER_TICK)
  console.log(' - MOVE_SPEED', MOVE_SPEED)
  console.log(' - SECTION_HEIGHT', SECTION_HEIGHT)
  console.log(' - HALF_HEIGHT', HALF_SECTION)
}

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
let bgCanvas
let bgCtx
let resCanvas
let resCtx
let lCanvas // level canvas
let lCtx // level context
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


// const getSong = () => (
//   [
//   [
//     [1, 0, 50],
//     [1, 0, 100],
//     [1, 0, 150],
//     [1, 0, 200],
//     [1, 0, 250],
//     [1, 0, 300],
//     [1, 0, 350],
//     [1, 0, 400],
//   ],
//   [
//     [
//       [7, 0, ,,, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//       [3, 0, ,,, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
//       // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//     ],
//     [
//       [7, 0, 19, 19, 23, 19, 26, 19, 26, 24, 17, 17, 21, 17, 24, 17, 24, 23],
//       [7, 0, 0, 7, 7, 11, 7, 14, 7, 14, 12, 5, 5, 9, 5, 12, 5, 12, 11],
//       // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//       // [5, 0, 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18, 14],
//       // [4, 0, , 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18],
//     ],
//     [
//       [7, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//       [3, 0, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
//       // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//     ],
//   ],
//   [
//     0,
//     1,
//   ],
//   60,
// ])
// hey ya
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
        [7, 0, ,,, 16, 16, 14, 12, 11, , 11, 11, 12, 11, 11, 9, 7, 9, 11, 11],
        [7, 0, ,,, , 4, 2, 0, -1, , -1, -1, 0, -1, -1, -3, -5, -3, -1, -1],
        // [3, 0, ,,, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
        // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      ],
      [
        [7, 0, 12, 11, 11, 9, 7, 9, 11, , 12, 12, 11, 11, 11, 11, , ],
        [7, 0, , 0, -1, -1, -3, -5, -3, -1, , 0, 0, -1, -1, -1, -1, ],
        // [7, 0, 0, 7, 7, 11, 7, 14, 7, 14, 12, 5, 5, 9, 5, 12, 5, 12, 11],
        // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
        // [5, 0, 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18, 14],
        // [4, 0, , 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18],
      ],
      [
        [7, 0, ,,, 16, 16, 14, 12, 11, , 11, 11, 12, 11, , 9, 7, 9, 11, 11],
        [7, 0, ,,, , 4, 2, 0, -1, , -1, -1, 0, -1, -1, -2, -4, -2, -1, -1],
        // [3, 0, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
        // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      ],
    ],
    [
      0,
      1,
    ],
    60,
  ]
)
let song
let songData
let songAudio
/* eslint-enable */

/* #endregion */

/* #region ******** BEATS ******** */

function BeatSprite(lane) {
  this.parent = lane

  this.y = -SECTION_HEIGHT
  this.width = Math.floor(board.offsetHeight / SECTION_SIZE)
  this.height = this.width
  this.played = false
  this.image = lane.beatImage
  this.zone = -1
  this.beat = undefined
  this.hit = false

  this.move = function (measureBeat, totalBeats) {
    if (!this.beat) {
      this.beat = totalBeats
    }
    this.y += MOVE_SPEED

    if (this.beat < totalBeats) {
      this.zone += 1
      this.beat = totalBeats
      this.y = SECTION_HEIGHT * this.zone
    }

    console.log(measureBeat)

    if (this.y > BOARD_HEIGHT) {
      this.parent.beats.pop()
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
    // this.element.style.top = convertPx(this.y)
    ctx.drawImage(this.image, this.parent.drawX, this.y)
  }
}

function spawnBeat(lane) {
  lane.beats.unshift(new BeatSprite(lane))
}

function getBeatImage(fillColor, strokeColor, showDebug) {
  const sCanvas = document.createElement('canvas')

  sCanvas.width = SECTION_HEIGHT
  sCanvas.height = SECTION_HEIGHT

  const sCtx = sCanvas.getContext('2d')

  if (showDebug) {
    sCtx.strokeStyle = 'red'
    sCtx.strokeRect(0, 0, SECTION_HEIGHT, SECTION_HEIGHT)
  }
  sCtx.fillStyle = fillColor
  sCtx.strokeStyle = strokeColor
  sCtx.beginPath()
  sCtx.arc(HALF_SECTION, HALF_SECTION, HALF_SECTION * .9, 0, Math.PI * 2)
  sCtx.fill()
  sCtx.stroke()

  return sCanvas
}

/* #endregion */

/* #region ******** LANES ******** */

const getNewLanesArr = () => ([
  {
    id: 0,
    name: 'bass',
    color: 'purple',
    beatImage: getBeatImage('blue', 'black', true),
    x: bassX,
    drawX: bassX - HALF_SECTION,
    spawning: false,
    instrument: bass,
    play: () => bass.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 1,
    name: 'kick',
    color: 'blue',
    beatImage: getBeatImage('green', 'black', true),
    x: kickX,
    drawX: kickX - HALF_SECTION,
    spawning: false,
    instrument: kick,
    play: () => kick.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 2,
    name: 'snare',
    color: 'yellow',
    beatImage: getBeatImage('yellow', 'black', true),
    x: snareX,
    drawX: snareX - HALF_SECTION,
    spawning: false,
    instrument: snare,
    play: () => snare.trigger(aCtx.currentTime),
    beats: [],
  },
  {
    id: 3,
    name: 'hihat',
    color: 'red',
    beatImage: getBeatImage('red', 'black', true),
    x: hihatX,
    drawX: hihatX - HALF_SECTION,
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
let lanesA
let lanesO

/* #endregion */

/* #region ******** COLLISION ******** */

function checkCollision(lane) {
  if (!lane.beats.length) {
    resCtx.drawImage(result.bad, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
  }
  let didHit = false

  for (let i = lane.beats.length; i > 0; i -= 1) {
    const sI = i - 1
    const sprite = lane.beats[sI]
    const sY = Math.floor(sprite.y)

    if (!sprite.hit) {
      if (sY >= ZONE_CHECK_BOTTOM) {
        // console.log('index', sI, 'too late')
        // resCtx.drawImage(result.bad, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        // continue

        // // This sprite was MISSED
        // Decrement the scorre/add a strike/whatever
        sprite.hit = true
        didHit = true

        continue
      }
      if (sY <= ZONE_CHECK_TOP) {
      // console.log('index', sI, 'too soon')
      // resCtx.drawImage(result.bad, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        continue
      // Shouldn't do anything about this one - just know that it will impac the score somehow.
      }
      if (sY < ZONE_CHECK_PERFECT_BOTTOM && sprite.y > ZONE_CHECK_PERFECT_TOP) {
      // console.log('... PERFECT ...')
        resCtx.drawImage(result.perfect, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        sprite.hit = true
        didHit = true
        continue
      }
      if (sY < ZONE_CHECK_GOOD_BOTTOM && sprite.y > ZONE_CHECK_GOOD_TOP) {
      // console.log('... GOOD ...')
        resCtx.drawImage(result.good, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        sprite.hit = true
        didHit = true
        continue
      }
      if (sY < ZONE_CHECK_OK_BOTTOM && sprite.y > ZONE_CHECK_OK_TOP) {
      // console.log('... OK ...')
        resCtx.drawImage(result.ok, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        sprite.hit = true
        didHit = true
        continue
      }
      if (sY < ZONE_CHECK_BOTTOM && sprite.y > ZONE_CHECK_TOP) {
      // console.log('... MEH ...')
        resCtx.drawImage(result.meh, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
        sprite.hit = true
        didHit = true
        continue
      }
    }
  }

  if (!didHit) {
    resCtx.drawImage(result.bad, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
  }
}

/* #endregion */

/* #region ******** LEVELS ******** */

let loadedLevels = 0
let currentLevelNum
let currentLevel
const levels = [l0, l1, l2, l3, l4, l5]

function parseLevels() {
  levels.forEach((lvl, i) => {
    lvl.data = {}
    lvl.length = lvl.image.width
    lvl.width = lvl.image.width
    lvl.height = lvl.image.height
    lCtx.drawImage(lvl.image, 0, 0)

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
        const currentResult = lCtx.getImageData(j, i, 1, 1).data[0] === 0 ? 1 : ''

        if (i < 4) {
          lvl.data[i].push(currentResult)
        }
        // Process metadata to find repeats
        else {
          const lookahead = lCtx.getImageData(j + 1, i, 1, 1).data[0] === 0 ? 1 : ''

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
  // console.log('GAMELOOP')
  if (isPlaying) {

    if (currentTick < aCtx.currentTime - TIME_PER_TICK) {
      // console.log('TICK')

      currentTick += TIME_PER_TICK

      for (let i = 0; i < lanesA.length; i += 1) {
        if (currentLevel.data[lanesA[i].id][sectionBeats]) {
          /**
       * PLAY zzfxP song here
       */
          if (currentRender === 0) {
            songAudio = zzfxP(...songData)

            currentRender = 1
          }
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

      // if (currentTick % (TIME_PER_TICK * 2) === 0) {
      //   // console.log('Measure event:', MeasureEvents.quarter, currentTick)
      // }
      // if (currentTick % (TIME_PER_TICK * 4) === 0) {
      //   // console.log('Measure event:', MeasureEvents.half, currentTick)
      //   // spawnBeat(bassLane, bassBeats)
      // }
      // if (currentTick % (TIME_PER_TICK * 8) === 0) {
      //   // console.log('Measure event:', MeasureEvents.whole, currentTick)
      // }
      // if (currentTick % (TIME_PER_TICK * 16) === 0) {
      //   // console.log('Measure event:', MeasureEvents.whole, currentTick)
      // }

      // Track each measure, 1 - 16
      measureBeat += measureBeat === 16 ? -15 : 1
      totalBeats += 1
    }

    // Do whatever
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    moveBeats()
    raf = requestAnimationFrame(gameLoop)
  }
}

function moveBeats() {
  for (let i = 0; i < lanesA.length; i += 1) {
    for (let j = 0; j < lanesA[i].beats.length; j += 1) {
      lanesA[i].beats[j].move(measureBeat, totalBeats)
    }
    checkComplete(i)
  }
}

/**
 *
 * @param {int} i lane index
 */
function checkComplete(i) {
  if (!isSpawning && lanesA[i].beats.length === 0 && lanesA[i].spawning) {
    lanesA[i].spawning = false
    console.log('this lane is done', lanesA[i].id, lanesA[i].name)
    spawningLanes -= 1
    if (spawningLanes === 0) {
      stopGame()
    }
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
    const x = 50 + (4 * (i + 1))
    const y = top

    bgCtx.fillStyle = colors[i]
    bgCtx.fillRect(x, y, 4, bottom - top)
    // const el = document.createElement('div')

    // el.style.position = 'absolute'
    // el.style.width = '4px'
    // el.style.backgroundColor = colors[i]
    // el.style.top = convertPx(top)
    // el.style.left = convertPx(50 + (4 * (i + 1)))
    // el.style.height = convertPx(bottom - top)

    // board.appendChild(el)
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
  songAudio.stop()
}

function spawnsComplete() {
  isSpawning = false
}

/* #endregion */

/* #region ******** INIT ******** */
function initGame() {
  BOARD_HEIGHT = boardWrapper.offsetHeight
  BOARD_WIDTH = board.offsetWidth
  SECTION_HEIGHT = Math.floor(boardWrapper.offsetHeight / SECTION_SIZE)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)
  LANE_WIDTH = SECTION_HEIGHT
  BOARD_MID = BOARD_WIDTH / 2
  HALF_SECTION = Math.floor(SECTION_HEIGHT / 2)

  ZONE_HEIGHT = SECTION_HEIGHT * 1.5
  ZONE_TOP = (Math.floor(BOARD_HEIGHT / SECTION_SIZE) * (SECTION_SIZE - 2)) - (SECTION_HEIGHT * 1.5)
  ZONE_CHECK_TOP = ZONE_TOP - (SECTION_HEIGHT / 1.5)
  ZONE_CHECK_BOTTOM = (SECTION_HEIGHT * 15) - (SECTION_HEIGHT / 3)
  // ZONE_CHECK_MEH_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  // ZONE_CHECK_MEH_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_GOOD_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 3)))
  ZONE_CHECK_GOOD_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 3)))
  ZONE_CHECK_PERFECT_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT))
  ZONE_CHECK_PERFECT_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT))

  // DEBUG render horizontal rows
  // renderRows()

  board.height = BOARD_HEIGHT
  board.width = BOARD_WIDTH
  board.style.position = 'absolute'

  boardWrapper.style.height = convertPx(BOARD_HEIGHT)

  // // Create the 'hit' zone one 'section' above the boattom of the board
  // zone.style.height = convertPx(ZONE_HEIGHT)
  // zone.style.top = convertPx(ZONE_TOP)

  bassX = (BOARD_MID - (HALF_SECTION * 3))
  kickX = BOARD_MID - HALF_SECTION
  snareX = (BOARD_MID + (HALF_SECTION))
  hihatX = (BOARD_MID + (HALF_SECTION * 3))

  drawBackground()
  result.perfect = getDrawResult('#17f5fc')
  result.good = getDrawResult('#1cfe3f')
  result.ok = getDrawResult('#f5ff3c')
  result.meh = getDrawResult('#ff9827')
  result.bad = getDrawResult('#fe1015')
  createDebugZones([
    [ZONE_CHECK_TOP, ZONE_CHECK_BOTTOM],
    // [ZONE_CHECK_MEH_TOP, ZONE_CHECK_MEH_BOTTOM],
    [ZONE_CHECK_OK_TOP, ZONE_CHECK_OK_BOTTOM],
    [ZONE_CHECK_GOOD_TOP, ZONE_CHECK_GOOD_BOTTOM],
    [ZONE_CHECK_PERFECT_TOP, ZONE_CHECK_PERFECT_BOTTOM],
  ])
  lanesA = getNewLanesArr()
  lanesO = getNewLanesObj()

  logValues()

  /* START GAME */
  startGame(3)
}

function getDrawResult(fillColor) {
  const sCanvas = document.createElement('canvas')

  sCanvas.width = SECTION_HEIGHT
  sCanvas.height = SECTION_HEIGHT * 2

  const sCtx = sCanvas.getContext('2d')

  sCtx.fillStyle = fillColor
  sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height)

  return sCanvas
}

function drawBackground() {
  bgCanvas.height = BOARD_HEIGHT
  bgCanvas.width = BOARD_WIDTH
  bgCanvas.classList.add('board')
  bgCanvas.style.position = 'absolute'
  bgCanvas.style.top = 0
  bgCanvas.style.left = '50%'
  bgCanvas.style.transform = 'translateX(-50%)'
  bgCanvas.id = 'bgBoard'
  bgCanvas.classList.add('board')
  resCanvas.height = BOARD_HEIGHT
  resCanvas.width = BOARD_WIDTH
  resCanvas.classList.add('board')
  resCanvas.style.position = 'absolute'
  resCanvas.style.top = 0
  resCanvas.style.left = '50%'
  resCanvas.style.transform = 'translateX(-50%)'
  boardWrapper.prepend(resCanvas)
  boardWrapper.prepend(bgCanvas)

  // DRAW ZONE:
  bgCtx.fillStyle = 'rgb(0, 0, 0)'
  bgCtx.setLineDash([4, 6])
  bgCtx.strokeRect(-2, ZONE_TOP, BOARD_WIDTH + 4, SECTION_HEIGHT * 1.5)

  // bass
  bgCtx.fillRect(bassX, 0, 1, BOARD_HEIGHT)
  // kick
  bgCtx.fillRect(kickX, 0, 1, BOARD_HEIGHT)
  // snare
  bgCtx.fillRect(snareX, 0, 1, BOARD_HEIGHT)
  // hihat
  bgCtx.fillRect(hihatX, 0, 1, BOARD_HEIGHT)

  // const half = hihatX - (hihatX / 2)

  // bgCtx.stroke()
  // bgCtx.fillRect(kickX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
  // bgCtx.fillRect(snareX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
  // bgCtx.fillRect(hihatX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
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
  lCanvas = $('#canvas')
  lCtx = lCanvas.getContext('2d')
  canvas = $('#board')
  ctx = canvas.getContext('2d')
  bgCanvas = document.createElement('canvas')
  bgCtx = bgCanvas.getContext('2d')
  resCanvas = document.createElement('canvas')
  resCtx = resCanvas.getContext('2d')
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

  // addLaneElements()

  levels.forEach((level, i) => makeLevel(i))

  body.style.width = `${bodyWidth}px`
  body.style.height = `${SCREEN_HEIGHT}px`
})

/* #endregion */
