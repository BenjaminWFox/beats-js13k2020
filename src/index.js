/* #region ******** IMPORTS ******** */

import { init as initKontra, clamp, Text, GameLoop, Scene, on } from 'kontra'
import Bass from './sound/bass'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'
import lt from './assets/images/levels/lt.png'
import l0 from './assets/images/levels/l0.png'
import l1 from './assets/images/levels/l1.png'
import l2 from './assets/images/levels/l2.png'
import l3 from './assets/images/levels/l3.png'
import l4 from './assets/images/levels/l4.png'
import l5 from './assets/images/levels/l5.png'
/* #endregion */

/* #region ******** CONSTANTS & GLOBAL VARS ******** */

// TICK_EVERY is the main timer for tracking audio `note` events.
const TICK_EVERY = 16
const FPS = 60
const BPM = 120
const TIME_PER_TICK = 60.0 / (TICK_EVERY / 4) / BPM
const HORIZONTAL_SECTIONS = 16
let VIEW_HEIGHT
let VIEW_WIDTH
let SECTION_HEIGHT
let BOARD_HEIGHT
let CANVAS_WIDTH
let CANVAS_MIDX
let ZONE_TOP
let BASS_X
let KICK_X
let SNARE_X
let HIHAT_X
const COLORS = {
  perfect: '#1cfe3f',
  good: '#17f5fc',
  ok: '#f5ff3c',
  meh: '#ff9827',
  bad: '#fe1015',
}

let canvas
let context
let bgCanvas
let bgCtx
let lCtx
let scene
let gamescene
let titlescene
let introscene
let loop

const introStrings = [
  'GRAPHICS',
  'ASSETS',
  'MELODIES',
  'BEATS',
  'ERROR 404\nBEATS\nNOT FOUND',
  'BEATS\nNOT FOUND',
]

const scenes = {
  introscene: 'introscene',
  titlescene: 'titlescene',
  gamescene: 'gamescene',
}

function setScene(s) {
  console.log('Setting scene', s)
  s.show()
  scene = s
}

/* #endregion */

/* #region ******** ALIASES & CONVENIENCE ******** */

const $ = document.querySelector.bind(document)
const convertPx = (n) => `${n}px`

/* #endregion */

/* #region ******** AUDIO ******** */
/* eslint-disable */
const AudioContext = window.AudioContext || window.webkitAudioContext
const aCtx = new AudioContext()
const bass = new Bass(aCtx)
const kick = new Kick(aCtx)
const snare = new Snare(aCtx)
const hihat = new HiHat(aCtx)


// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
const zzfx = (...t) => zzfxP(zzfxG(...t))
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
const zzfxP = (T, ...t) => { 
  let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
  t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination), e.start(T);
  return e 
}
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

const getSong0 = () => (
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
    // Keep 1 beat before first notes to align this with the metronome...
    [
      [7, 0, , 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      [3, 0, , 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
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
    2,
    1,
    2,
    1,
    2,
    1,
    2
  ],
  60,
])
// hey ya
const getSong1 = () => (
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
      2,
      1,
      2,
      1,
      2,
      1,
      2
    ],
    60,
  ]
)
let song
let songData
let songAudio
/**/
  song = getSong0()
  songData = zzfxM(...song)
  // songAudio = zzfxP(aCtx.currentTime + 5, ...songData)
  // songAudio.start()
/* eslint-enable */
/* #endregion */

/* #region ******** LEVELS ******** */

const levels = [l0, l1, l2, l3, l4, l5]
let loadedLevels = 0

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
  }
}

/* #endregion */

/* #region ******** GAME LOOP ******** */

let currentTick
let time = 0
let cT = 0
const gl = () => GameLoop({
  update(dt) {
    time += dt

    switch (scene.id) {
      case scenes.introscene:
        const tC = introscene.children[1] // eslint-disable-line

        switch (tC.text) {
          case introStrings[0]:
          case introStrings[1]:
          case introStrings[2]:
            if (!fadeOverTimeAfterDelay(cT, time, 1, tC)) {
              cT = time
              introscene.text += 1
              swapToNextIntroEl(tC, introscene.text)
            }
            break
          case introStrings[3]:
            fadeOverTimeAfterDelay(cT, time, 3, introscene.children[0])
            if (!fadeOverTimeAfterDelay(cT, time, 3, tC)
            ) {
              cT = time
              tC.color = COLORS.bad
              swapToNextIntroEl(tC, 4)
            }
            break
          case introStrings[4]:
            if (blinkOverTime(cT, time, 1, tC) === 'off' && cT + 3 < time) {
              setScene(titlescene)
            }
            break
          default:
            break
        }
        break
      case scenes.titlescene:
        if (titlescene.children[0].opacity < 1) {
          fadeIn(titlescene.children[0])
        }
        if (titlescene.children[1].opacity < 1) {
          fadeIn(titlescene.children[1])
        }
        if (titlescene.children[2].opacity < 1) {
          fadeIn(titlescene.children[2])
        }
        if (!current16thNote) {
          current16thNote = 0
        }
        scheduler()
        // doAudioStuff()
        break
      default:
        break
    }
  },
  render() {
    switch (scene.id) {
      case scenes.introscene:
        introscene.render()
        break
      case scenes.titlescene:
        drawBackground()
        titlescene.render()
        break
      default:
        break
    }
  },
})

/** METRONOME */
let nextNoteTime = 0.0
const scheduleAheadTime = .01
let current16thNote
const tempo = BPM
const lookahead = 25.0
const noteResolution = 0
const notesInQueue = []

function nextNote() {
  // Advance current note and time by a 16th note...
  const secondsPerBeat = 60.0 / tempo // Notice this picks up the CURRENT

  // tempo value to calculate beat length.
  nextNoteTime += 0.25 * secondsPerBeat // Add beat length to last beat time

  current16thNote++ // Advance the beat number, wrap to zero
  if (current16thNote == 16) {
    current16thNote = 0
  }
}

let firstNote = true

function scheduleNote(beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time })

  if ((noteResolution == 1) && (beatNumber % 2)) {
    return
  } // we're not playing non-8th 16th notes
  if ((noteResolution == 2) && (beatNumber % 4)) {
    return
  } // we're not playing non-quarter 8th notes

  // create an oscillator
  // const osc = audioContext.createOscillator()

  // osc.connect(audioContext.destination)
  // beat 0 == high pitch
  console.log(beatNumber)
  if (beatNumber % 16 === 0) {
    // osc.frequency.value = 880.0
  }
  // quarter notes = medium pitch
  if (beatNumber % 4 === 0) {
    if (firstNote) {
      console.log('firstNote') // .
      songAudio = zzfxP(time, ...songData)
      firstNote = false
    }

    hihat.trigger(time)

    // osc.frequency.value = 440.0
  }
  // other 16th notes = low pitch
  else {
    // osc.frequency.value = 220.0
  }

  // osc.start(time)
  // osc.stop(time + noteLength)
  // }

}

function scheduler() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < aCtx.currentTime + scheduleAheadTime) {
    console.log('Schedule!')
    scheduleNote(current16thNote, nextNoteTime)
    nextNote()
  }
}
/** END METRONOME */
function doAudioStuff() {
  if (!currentTick) {
    currentTick = aCtx.currentTime
  }
  else {
    if (currentTick < aCtx.currentTime - TIME_PER_TICK) {
      console.log('16th Tick', currentTick, aCtx.currentTime)
      currentTick += TIME_PER_TICK
    }
  }
}

/* #endregion */

/* #region ******** DRAWING ******** */

function drawBackground() {
  // DRAW ZONE:
  context.fillStyle = '#ffffff'
  context.strokeStyle = '#ffffff'
  context.setLineDash([4, 6])
  context.strokeRect(-2, ZONE_TOP, CANVAS_WIDTH + 4, SECTION_HEIGHT * 1.5)

  // bass
  context.fillStyle = '#222222'
  context.strokeStyle = '#f9f9f9'
  context.fillRect(BASS_X, 0, 1, BOARD_HEIGHT)
  // kick
  context.fillRect(KICK_X, 0, 1, BOARD_HEIGHT)
  // snare
  context.fillRect(SNARE_X, 0, 1, BOARD_HEIGHT)
  // hihat
  context.fillRect(HIHAT_X, 0, 1, BOARD_HEIGHT)

  // const half = hihatX - (hihatX / 2)

  // bgCtx.stroke()
  // bgCtx.fillRect(kickX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
  // bgCtx.fillRect(snareX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
  // bgCtx.fillRect(hihatX - HALF_SECTION, BOARD_HEIGHT - (SECTION_HEIGHT * 2), SECTION_HEIGHT, SECTION_HEIGHT * 2)
  // bgCtx.stroke()
}
/* #endregion */

/* #region ******** INIT ******** */
function handleKeyboardControl(event) {
  switch (scene.id) {
    case scenes.introscene:
      switch (event.code) {
        case 'Space':
          setScene(titlescene)
          break
        default:
          break
      }
      break
    case scenes.titlescene:
      switch (event.code) {
        case 'Space':
          setScene(gamescene)
          break
        default:
          playFromKeycode(event.code)
          break
      }
      break
    case scenes.gamescene:
      playFromKeycode(event.code)
      break
    default:
      break
  }
}

function playFromKeycode(code) {
  switch (code) {
    case 'KeyD':
      bass.trigger(aCtx.currentTime)
      // lanesO.bass.play()
      // zzfx(...[,0,75,,.05,.5,,,-0.1,,,,,,,,,,.05])
      // zzfx(...[,0,75,,,.5,,,-0.2,.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.75,,,-0.1,,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,75,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // checkCollision(lanesO.bass)
      break
    case 'KeyF':
      kick.trigger(aCtx.currentTime)
      // lanesO.kick.play()
      // zzfx(...[,0,125,,.05,.25,,2.5,-0.1]) // KICK
      // zzfx(...[,0,110,,,.05,1,.8,-0.2,-0.4,,,,,,,,.5,.29])
      // zzfx(...[,0,115,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,125,,,.5,,,-0.2,-0.1,,,,,,,,.5,.05])
      // checkCollision(lanesO.kick)
      break
    case 'KeyJ':
      snare.trigger(aCtx.currentTime)
      // lanesO.snare.play()
      // checkCollision(lanesO.snare)
      break
    case 'KeyK':
      hihat.trigger(aCtx.currentTime)
      // lanesO.hihat.play()
      // checkCollision(lanesO.hihat)
      break
    default:
      return
  }
}

function startGameWhenReady() {
  if (loadedLevels === levels.length) {
    // Init the game, lots of stuff...
    initGame()

    // Start the loop
    loop = gl()
    loop.start()
  }
  else {
    setTimeout(startGameWhenReady, 250)
  }
}

// EVERYTHING STARTS HERE
window.addEventListener('load', () => {
  ({ canvas, context } = initKontra('board'))

  window.addEventListener('keydown', handleKeyboardControl)

  // After the levels have all loaded (images)
  // it will call `initGame()`
  levels.forEach((level, i) => makeLevel(i))

  startGameWhenReady()
})

function initGame() {
  getElements()
  parseLevels()
  initConstants()
  initUi()
  initScenes()

  // introscene.show()
  setScene(introscene)
}

function getElements() {
  bgCanvas = $('#bgBoard')
  bgCtx = bgCanvas.getContext('2d')
  lCtx = $('#canvas').getContext('2d')
}

function initConstants() {
  VIEW_HEIGHT = window.innerHeight
  BOARD_HEIGHT = VIEW_HEIGHT
  VIEW_WIDTH = window.innerWidth
  SECTION_HEIGHT = Math.floor(VIEW_HEIGHT / HORIZONTAL_SECTIONS)
  CANVAS_WIDTH = SECTION_HEIGHT * 5
  CANVAS_MIDX = CANVAS_WIDTH / 2
  // The y top coord of the hit zone
  console.log(BOARD_HEIGHT, HORIZONTAL_SECTIONS, SECTION_HEIGHT)
  ZONE_TOP = (Math.floor(BOARD_HEIGHT / HORIZONTAL_SECTIONS) * (HORIZONTAL_SECTIONS - 2)) - (SECTION_HEIGHT * 1.5)

  BASS_X = (CANVAS_MIDX - ((SECTION_HEIGHT / 2) * 3))
  KICK_X = CANVAS_MIDX - (SECTION_HEIGHT / 2)
  SNARE_X = (CANVAS_MIDX + ((SECTION_HEIGHT / 2)))
  HIHAT_X = (CANVAS_MIDX + ((SECTION_HEIGHT / 2) * 3))

}

function initUi() {
  $('#body').style.height = `${VIEW_HEIGHT}px`
  canvas.height = VIEW_HEIGHT
  bgCanvas.height = VIEW_HEIGHT
  canvas.width = SECTION_HEIGHT * 5
  bgCanvas.width = canvas.width
  $('#board-wrapper').style.width = `${canvas.width}px`
}

function initScenes() {
  gamescene = Scene({
    id: scenes.gamescene,
    children: [],
  })
  introscene = Scene({
    id: scenes.introscene,
    text: 0,
    children: [
      Text({
        text: 'LOADING',
        color: COLORS.good,
        x: CANVAS_MIDX,
        y: 100,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
        font: gFont(40),
      }),
      Text({
        text: 'GRAPHICS',
        color: COLORS.perfect,
        x: CANVAS_MIDX,
        y: 160,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
        font: gFont(60),
      }),
      Text({
        x: CANVAS_MIDX,
        y: 500,
        color: COLORS.good,
        anchor: { x: .5, y: .5 },
        text: 'SKIP\n[ space ]',
        textAlign: 'center',
        font: gFont(30),
      }),
    ],
    onShow() {
      console.log('Showing intro')
    },
  })
  titlescene = Scene({
    id: scenes.titlescene,
    children: [
      introscene.children[1],
      introscene.children[0],
      introscene.children[2],
    ],
    onShow() {
      this.children[0].text = introStrings[5]
      this.children[0].color = COLORS.bad
      this.children[2].text = 'START\n[ space ]',
      this.children[0].opacity = 0
      this.children[2].opacity = 0
      this.children[1].y = 350
      this.children[1].opacity = 0
      this.children[1].color = COLORS.perfect
      this.children[1].text = 'Prepare For\nManual Re-entry...'
      this.children[1].font = gFont(30)
    },
    // render() {
    //   drawBackground()
    // },

  })
}

function gFont(s) {
  return `${s}px Impact, AvenirNextCondensed-Heavy, Arial-BoldMT, Arial-black, Arial`
}

/* #endregion */

/* #region ******** ANIMATION FUNCTIONS ******** */

function fadeOverTimeAfterDelay(c, t, del, el) {
  if (c + del > t) {
    return true
  }
  if (el.opacity > 0) {
    el.opacity = clamp(0, 1, el.opacity - .2)

    return true
  }

  return false
}
function swapToNextIntroEl(el, i, fadeIn = false) {
  el.text = introStrings[i]

  if (fadeIn) {
    el.opacity = clamp(0, 1, el.opacity + .05)
  }
  else {
    el.opacity = 1
  }
}
function fadeIn(el) {
  if (el.opacity < 1) {
    el.opacity = clamp(0, 1, el.opacity + .05)
  }
}
function blinkOverTime(c, t, dur, el) {
  if (el.fin === undefined) {
    el.fin = el.opacity === 0
  }

  if (!el.fin && el.opacity >= 0) {
    el.opacity = clamp(0, 1, el.opacity - .05)

    if (el.opacity === 0) {
      el.fin = true

      return 'off'
    }
  }

  if (el.fin && el.opacity <= 1) {
    el.opacity = clamp(0, 1, el.opacity + .05)

    if (el.opacity === 1) {
      el.fin = false

      return 'on'
    }

    return true
  }
}

/* #endregion */
