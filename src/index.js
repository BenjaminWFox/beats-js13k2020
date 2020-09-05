/* #region ******** IMPORTS ******** */

import { init as initKontra, clamp, Text, GameLoop, Scene } from 'kontra'
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
import l6 from './assets/images/levels/l6.png'
import ltest from './assets/images/levels/ltest.png'
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
let MOVE_SPEED
let ZONE_TOP
let BASS_X
let KICK_X
let SNARE_X
let HIHAT_X

let ZONE_HEIGHT
let ZONE_CHECK_TOP
let ZONE_CHECK_BOTTOM
let ZONE_CHECK_OK_TOP
let ZONE_CHECK_OK_BOTTOM
let ZONE_CHECK_GOOD_TOP
let ZONE_CHECK_GOOD_BOTTOM
let ZONE_CHECK_PERFECT_TOP
let ZONE_CHECK_PERFECT_BOTTOM

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
let prelevelscene
let postlevelscene
let gameoverscene
let currentLevel
let levelRepeats
let levelStarted = false
let spawnsComplete = false
let loop
let score = 0
let audioReady = undefined

let loadedLevels = 0
const levels = [lt, l0, l1, l2, l3, l4, l5, l6]
// const levels = [lt, ltest]

let beatsInTransit = []
let beatsToHittest = []
let beatsToIgnore = []
let scorePoppers = []

const clearAllBeats = () => {
  beatsInTransit = []
  beatsToHittest = []
  beatsToIgnore = []
}

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
  prelevelscene: 'prelevelscene',
  gamescene: 'gamescene',
  postlevelscene: 'postlevelscene',
  gameoverscene: 'gameoverscene',
}

const result = {
  perfect: {
    text: 'PERFECT',
    color: COLORS.perfect,
    points: 1000,
  },
  good: {
    text: 'GOOD',
    color: COLORS.good,
    points: 750,
  },
  ok: {
    text: 'OK',
    color: COLORS.ok,
    points: 500,
  },
  meh: {
    text: 'MEH',
    color: COLORS.meh,
    points: 250,
  },
  bad: {
    text: 'BAD',
    color: COLORS.bad,
    points: -500,
  },
}

let beats

function setScene(s) {
  s.show()
  scene = s
}

/* #endregion */

/* #region ******** ALIASES & CONVENIENCE ******** */

const $ = document.querySelector.bind(document)
const convertPx = (n) => `${n}px`

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)

    return v.toString(16)
  })
}
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
const zzfxP = (...t) => {
  let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
  t.map((d, i) => f.getChannelData(i).set(d)), e.buffer = f, e.connect(zzfxX.destination);
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
      // Keep 3 beats before first notes to align this with the metronome...
      // Seems to give the best results.
      // // METRONOME
      // [
      //   // [7, 0, ,,,,,,,23,,,,,,,,],
      //   [3, 0, 21,  , 9,  , 9,  , 9,  ,21,  , 9,  , 9,  , 9,  ,21,  , 9,  , 9,  , 9,  ,21,  , 9,  , 9,  , 9,  ,],
      //   [3, 0, 21,-3,-3,-3,-3,-3,-3,-3,21,-3,-3,-3,-3,-3,-3,-3,21,-3,-3,-3,-3,-3,-3,-3,21,-3,-3,-3,-3,-3,-3, -3],
      //   // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
      // ],
      [
        [7, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
        [3, 0, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
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
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
    ],
    60,
  ])
// hey ya
const getSong1 = () => (
  // [[[,0,400]],[[[,-1,25,25,23,21,20,,20,20,21,20,20,18,16,18,20,20,21,20,20,18,16,18,20,,21,21,20,20,20,20,,],[,,20,20,20,18,20,18,18,18,18,18,18,20,18,20,18,13,20,20,20,18,20,18,18,18,18,18,18,20,20,18,13],[,1,32,32,30,28,27,,27,27,28,27,27,25,23,25,27,27,28,27,27,25,23,25,27,,28,28,27,27,27,27,,]]],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],60,{"title":"HeyYa","instruments":["Instrument 0"],"patterns":["Pattern 0"]}]
  [[[,0,400]],[[[,,20,20,20,18,20,18,18,18,18,18,18,20,18,20,18,13,20,20,20,18,20,18,18,18,18,18,18,20,20,18,13,13],[,1,32,32,30,28,27,,27,27,28,27,27,25,23,25,27,27,28,27,27,25,23,25,27,,28,28,27,27,27,27,27,,]]],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],60,{"title":"HeyYa-2","instruments":["Instrument 0"],"patterns":["Pattern 0"]}]
)
// const getSong1 = () => (
//   [
//     [
//       [1, 0, 50],
//       [1, 0, 100],
//       [1, 0, 150],
//       [1, 0, 200],
//       [1, 0, 250],
//       [1, 0, 300],
//       [1, 0, 350],
//       [1, 0, 400],
//     ],
//     [
//       [
//         [7, 0, 16, 16, 14, 12, 11, , 11, 11, 12, 11, 11, 9, 7, 9, 11, 11],
//         [7, 0, , 4, 2, 0, -1, , -1, -1, 0, -1, -1, -3, -5, -3, -1, -1],
//         // [3, 0, ,,, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
//         // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//       ],
//       [
//         [7, 0, 12, 11, 11, 9, 7, 9, 11, , 12, 12, 11, 11, 11, 11, ,],
//         [7, 0, , 0, -1, -1, -3, -5, -3, -1, , 0, 0, -1, -1, -1, -1,],
//         // [7, 0, 0, 7, 7, 11, 7, 14, 7, 14, 12, 5, 5, 9, 5, 12, 5, 12, 11],
//         // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//         // [5, 0, 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18, 14],
//         // [4, 0, , 11, 11, 14, 11, 16, 11, 18, 16, 14, 14, 18, 14, 21, 14, 18],
//       ],
//       [
//         [7, 0, 16, 16, 14, 12, 11, , 11, 11, 12, 11, , 9, 7, 9, 11, 11],
//         [7, 0, , 4, 2, 0, -1, , -1, -1, 0, -1, -1, -2, -4, -2, -1, -1],
//         // [3, 0, 0, 9, 33, 12, 33, 14, 9, 40, 14, 36, 12, 40, 12, 43, 12, 36],
//         // [5, 0, 21, 21, 24, 21, 26, 21, 28, 26, 24, 24, 28, 24, 31, 24, 28, 24],
//       ],
//     ],
//     [
//       0,
//       1,
//       2,
//       1,
//       2,
//       1
//     ],
//     60,
//   ]
// )
// we will rock you
const getSong2 = () => (
  [[[,0,200]],[[[,,13,,,,12,,,,10,,,,8,,,,10,,10,,13,,,,12,,,,10,,,,8,,,,10,,10,,],[,,25,27,27,27,27,27,27,27,27,27,27,27,27,27,27,25,27,32,30,30,25,27,27,27,27,25,27,27,27,25,25,25,22,22,20,20,20,18,15,15]]],[0],60,{"title":"New Song","instruments":["Instrument 0"],"patterns":["Pattern 0"]}]
)
const getSong3 = () => (
  [[[,0,200]],[[[,,13,13,16,13,18,13,20,18,16,16,20,16,23,16,20,16,11,11,15,11,18,11,18,16,9,9,13,9,16,9,16,15]]],[0,0,0,0,0,0,0,0,0,0],60,{"title":"New Song","instruments":["Instrument 0"],"patterns":["Pattern 0"]}]
)
const SONGS = [
  getSong0(),
  getSong1(),
  getSong2(),
  getSong3(),
]
let songAudio
let audioStarted

function getNewSong(i) {
  let s = SONGS[i]
  let sD = zzfxM(...s)
  return zzfxP(...sD)
}
songAudio = getNewSong(1)

// song1 = getSong0()
// songData1 = zzfxM(...song1)
// songAudio1 = zzfxP(...songData1)
// song2 = getSong1()
// songData2 = zzfxM(...song2)
// songAudio2 = zzfxP(...songData2)
/**/
// songAudio = zzfxP(aCtx.currentTime + 5, ...songData)
// songAudio.start()
/* eslint-enable */
/* #endregion */

/* #region ******** SCORE / POPPER ******** */

function PopperSprite(res, x, i) {
  this.sprite = Text({
    x,
    y: ZONE_TOP - (SECTION_HEIGHT / 2),
    color: res.color,
    anchor: { x: .5, y: .5 },
    text: res.text,
    textAlign: 'center',
    font: gFont(25),
    opacity: 1,
  }),
  this.update = function () {
    if (this.sprite.opacity > 0) {
      this.sprite.opacity = clamp(0, 1, this.sprite.opacity - .01)
      this.sprite.y -= 2
    }
    else {
      scorePoppers.pop()
    }
  }
  this.render = function () {
    this.sprite.render()
  }
}

function spawnScorePopper(res, i) {
  scorePoppers.unshift(new PopperSprite(res, beats[i].x, i))
  switch (res.text) {
    case result.perfect.text:
      score += result.perfect.points
      break
    case result.good.text:
      score += result.good.points
      break
    case result.ok.text:
      score += result.ok.points
      break
    case result.meh.text:
      score += result.meh.points
      break
    case result.bad.text:
      score += result.bad.points
      break
    default:
      break
  }
  gamescene.children[1].text = `SCORE:\n${score}`
}

/* #endregion */

/* #region ******** BEATS ******** */

function BeatSprite(i) {
  this.id = uuidv4()
  this.startTime = aCtx.currentTime
  this.index = i
  this.beat = beats[i]
  this.y = -(SECTION_HEIGHT * 2)
  this.x = this.beat.x - (SECTION_HEIGHT / 2)
  this.image = this.beat.image
  this.hit = false
  this.beat = undefined
  this.zone = -2
  this.phase = 0

  // console.log('CREATING SPRITE', this.id, this.y)

  this.move = function (measureBeat, totalBeats) {
    if (!this.beat) {
      this.beat = totalBeats
    }

    if (currentLevel === 0 && this.y >= (ZONE_TOP)) {
      this.y = ZONE_TOP
    }
    else {
      this.y += MOVE_SPEED

      // console.log('Moving...', this.y)

      // console.log(this.beat, totalBeats)

      if (this.beat < totalBeats) {
        // console.log('Reconciling...', this.beat, totalBeats)

        this.zone += 1
        this.beat = totalBeats

        // console.log('  --', this.y, SECTION_HEIGHT * this.zone)

        this.y = SECTION_HEIGHT * this.zone
        // console.log('Time reconciler', aCtx.currentTime, this.startTime + (TIME_PER_TICK * this.zone))
      }
    }
    // Reconciliation between animation and audio
    // We know where the beat SHOULD be every measure (16 16th notes)

    if (this.phase === 0 && this.y > ZONE_TOP - SECTION_HEIGHT) {
      if (this.id === beatsInTransit[beatsInTransit.length - 1].id) {
        beatsInTransit.pop()
        beatsToHittest.unshift(this)
        this.phase = 1
      }
    }
    // if (this.y > SECTION_HEIGHT * 15) {
    //   beatsToHittest.pop()
    //   beatsToIgnore.unshift(this)
    // }

    if (this.y > BOARD_HEIGHT) {
      if (!this.hit) {
        spawnScorePopper(result.bad, this.index)
        console.log('Hey, you missed this one...')
      }
      beatsToHittest.pop()
    }
    // if (!this.played && this.y > ZONE_TOP) {
    //   this.parent.play()
    //   this.played = true
    // }
  }

  this.render = () => {
    console.log()
    context.drawImage(this.image, this.x, this.y)
  }
}

function spawnBeat(i) {
  beatsInTransit.unshift(new BeatSprite(i))
}

function getBeatImage(fillColor, strokeColor, key, showDebug) {
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
  sCtx.arc(SECTION_HEIGHT / 2, SECTION_HEIGHT / 2, SECTION_HEIGHT / 2 * .9, 0, Math.PI * 2)
  sCtx.fill()
  sCtx.stroke()
  sCtx.fillStyle = '#000'
  sCtx.font = gFont(48)
  sCtx.textAlign = 'center'
  sCtx.textBaseline = 'middle'
  sCtx.fillText(key, 0 + (SECTION_HEIGHT / 2), 0 + (SECTION_HEIGHT / 2))

  return sCanvas
}

/* #endregion */

/* #region ******** COLLISION ******** */

function checkCollision(beatIndex) {
  if (!beatsToHittest.length) {
    console.log('NO BEAT!')
    spawnScorePopper(result.bad, beatIndex)
    // context.drawImage(result.bad, lane.drawX, BOARD_HEIGHT - (SECTION_HEIGHT * 2))
  }
  else {
    let didHit = false

    for (let i = beatsToHittest.length; i > 0; i -= 1) {
      const sI = i - 1
      const sprite = beatsToHittest[sI]

      if (sprite.index !== beatIndex) {
        // console.log('Current sprite not in this lane')

        continue
      }

      const sY = Math.floor(sprite.y)

      if (!sprite.hit) {
        if (sY >= ZONE_CHECK_BOTTOM) {
          // console.log('SPRITE MISSED!')
          spawnScorePopper(result.bad, beatIndex)

          didHit = setHit(sprite)

          continue
        }
        if (sY <= ZONE_CHECK_TOP) {
          // console.log('TOO SOON!')
          continue
          // Shouldn't do anything about this one - just know that it will impac the score somehow.
        }
        if (sY < ZONE_CHECK_PERFECT_BOTTOM && sprite.y >= ZONE_CHECK_PERFECT_TOP) {
          // console.log('... PERFECT ...')
          spawnScorePopper(result.perfect, beatIndex)
          didHit = setHit(sprite)
          continue
        }
        if (sY < ZONE_CHECK_GOOD_BOTTOM && sprite.y >= ZONE_CHECK_GOOD_TOP) {
          // console.log('... GOOD ...')
          spawnScorePopper(result.good, beatIndex)
          didHit = setHit(sprite)
          continue
        }
        if (sY < ZONE_CHECK_OK_BOTTOM && sprite.y >= ZONE_CHECK_OK_TOP) {
          // console.log('... OK ...')
          spawnScorePopper(result.ok, beatIndex)
          didHit = setHit(sprite)
          continue
        }
        if (sY < ZONE_CHECK_BOTTOM && sprite.y >= ZONE_CHECK_TOP) {
          // console.log('... MEH ...')
          spawnScorePopper(result.meh, beatIndex)
          didHit = setHit(sprite)
          continue
        }
      }
    }

    if (!didHit) {
      // console.log('Did not hit anything!')
      if (scene.id === scenes.gamescene) {
        spawnScorePopper(result.bad, beatIndex)
      }
    }
  }
}

function setHit(s) {
  if (scene.id === scenes.gamescene) {
    s.hit = true

    return true
  }
}

/* #endregion */

/* #region ******** LEVELS ******** */

function goToNextLevel() {
  setCurrentLevel(currentLevel + 1)
}

function replaySameLevel() {
  setCurrentLevel(currentLevel)
}

function setCurrentLevel(i) {
  currentLevel = i

  if (i >= levels.length) {
    console.log('OUT OF LEVELS')

    setScene(gameoverscene)
  }
  else {
    currentLevel = i
    levelStarted = false
    spawnsComplete = false
    clearMusicTrackers()
    resetAllAssets()
    setScene(prelevelscene)
  }
}

function resetAllAssets() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  score = 0
  beatsInTransit = []
  beatsToHittest = []
  scorePoppers = []
  levelRepeats = [...levels[currentLevel].data[4]]
  if (audioStarted) {
    audioStarted = false
    songAudio.stop()
  }
}

function setSpawnsComplete() {
  spawnsComplete = true
}

function completeLevel() {
  console.log('Level Complete')
  setScene(postlevelscene)
}

function stopLevel() {
  setCurrentLevel(currentLevel + 1)
}

function startLevel() {
  nextNoteTime = aCtx.currentTime
  // if (currentLevel > 0) {
  //   songAudio.start()
  // }
  levelStarted = true
}

function parseLevels() {
  // `levels` array is replaced with obejcts in the
  // `makeLevel` function
  levels.forEach((lvl, i) => {
    lvl.data = {}
    lvl.length = lvl.image.width
    lvl.width = lvl.image.width
    lvl.height = lvl.image.height
    lCtx.drawImage(lvl.image, 0, 0)

    let processingBeat = 1
    let totalMeasures = 0
    // eslint-disable-next-line
    let totalLevelBeats = 0
    // eslint-disable-next-line
    let measureBeats = 0

    // There will be 5 levels of height. 4 lanes, then metadata.
    for (let n = 0; n < lvl.height; n += 1) {
      lvl.data[n] = []
      let repeats = 0

      // Width is the number of beat `sections`
      // `sections` may repeat n times, specified in the height metadata
      for (let j = 0; j < lvl.width; j += 1) {
        // Process lanes 0 - 3 the same
        const currentResult = lCtx.getImageData(j, n, 1, 1).data[0] === 0 ? 1 : ''

        if (n < 4) {
          measureBeats += currentResult === 1 ? 1 : 0
          lvl.data[n].push(currentResult)
        }
        // Process metadata to find repeats
        else {
          const lookahead = lCtx.getImageData(j + 1, n, 1, 1).data[0] === 0 ? 1 : ''

          // If there is no result,
          if (!currentResult) {
            lvl.data[n].push(currentResult)
          }
          else if (lookahead && j !== lvl.width - 1) {
            repeats += 1
            totalMeasures += 1
            lvl.data[n].push('')
          }
          else if (currentResult && (!lookahead || j === lvl.width - 1)) {
            lvl.data[n].push(repeats)
            measureBeats = measureBeats * (repeats + 1)
            totalLevelBeats += measureBeats

            repeats = 0
            measureBeats = 0
          }

          processingBeat += 1
        }
      }
    }

    lvl.songRepeats = Math.ceil(totalMeasures / 2)
    lvl.totalBeats = totalLevelBeats
    lvl.maxScore = totalLevelBeats * result.perfect.points
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

        if (levelStarted) {
          if (titlescene.children[3].opacity > 0) {
            fadeOut(titlescene.children[3])
          }

          facilitateCurrentLevel()
        }
        break
      case scenes.prelevelscene:
        if (prelevelscene.children[0].opacity < 1
          || prelevelscene.children[1].opacity < 1
          || prelevelscene.children[2].opacity < 1) {
          fadeIn(prelevelscene.children[0])
          fadeIn(prelevelscene.children[1])
          fadeIn(prelevelscene.children[2])
        }
        break
      case scenes.gamescene:
        if (
          gamescene.children[0].opacity > 0
            || gamescene.children[2].opacity > 0) {
          fadeOut(gamescene.children[0])
          fadeOut(gamescene.children[2])
        }
        if (gamescene.children[1].opacity < 1) {
          fadeIn(gamescene.children[1])
        }

        facilitateCurrentLevel()

        if (spawnsComplete) {
          if (beatsInTransit.length === 0 && beatsToHittest.length === 0) {
            completeLevel()
          }
        }
        break
      case scenes.postlevelscene:
        if (postlevelscene.children[0].opacity < 1
          || postlevelscene.children[1].opacity < 1
          || postlevelscene.children[2].opacity < 1) {
          fadeIn(postlevelscene.children[0])
          fadeIn(postlevelscene.children[1])
          fadeIn(postlevelscene.children[2])
        }
        break
      case scenes.gameoverscene:
        if (gameoverscene.children[0].opacity < 1
          || gameoverscene.children[1].opacity < 1
          || gameoverscene.children[2].opacity < 1) {
          fadeIn(gameoverscene.children[0])
          fadeIn(gameoverscene.children[1])
          fadeIn(gameoverscene.children[2])
        }
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
        renderAnyBeats()
        renderAnyPoppers()
        titlescene.render()
        break
      case scenes.prelevelscene:
        drawBackground()
        prelevelscene.render()
        break
      case scenes.gamescene:
        drawBackground()
        renderAnyBeats()
        renderAnyPoppers()
        gamescene.render()
        break
      case scenes.postlevelscene:
        drawBackground()
        postlevelscene.render()
        break
      case scenes.gameoverscene:
        gameoverscene.render()
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
let totalBeats
let sectionBeats
let beatsSinceRepeat
let sectionRepeats
const tempo = BPM
// const lookahead = 25.0

function clearMusicTrackers() {
  current16thNote = 0
  totalBeats = 0
  sectionBeats = 0
  beatsSinceRepeat = 0
  sectionRepeats = 0
}

function nextNote() {
  // Advance current note and time by a 16th note...
  const secondsPerBeat = 60.0 / tempo // Notice this picks up the CURRENT

  // tempo value to calculate beat length.
  nextNoteTime += 0.25 * secondsPerBeat // Add beat length to last beat time

  current16thNote++ // Advance the beat number, wrap to zero

  if (current16thNote === 16) {
    current16thNote = 0
  }
}

function scheduleNote(beatNumber, time) {
  // // Every new measure
  if (!audioStarted && audioReady === undefined) {
    audioReady = false
  }
  else if (!audioStarted && audioReady === false) {
    audioReady = true
  }
  else if (!audioStarted && audioReady === true) {
    // If this is the beginning of the audio, just set these together.
    // Otherwise it seems like odd things happen when it tries to catch up
    // nextNoteTime = aCtx.currentTime
    // Trigger the initial play.
    current16thNote = 0
    songAudio.start(time)
    audioStarted = true

    console.log('INITIAL BEAT', current16thNote, beatNumber, totalBeats)

    checkForLevelSpawns(totalBeats)
    totalBeats += 1
  }
  else if (audioStarted) {

    checkForLevelSpawns(totalBeats)

    // console.log('BEAT', beatNumber, totalBeats)

    if (beatNumber % 16 === 0) {
      // snare.trigger(time)
      console.log('~~ MEASURE ~~', (totalBeats) / 16)
    }

    totalBeats += 1
  }

  // // quarter notes = medium pitch .s
  // if (beatNumber % 4 === 0) {
  // }

  // half notes
  // if (beatNumber % 2 === 0) {
  //   // bass.trigger(time)
  // }

  // Run every 16th note

  // snare.trigger(time)

  // console.log(beatNumber)
}

function scheduler() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < aCtx.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime)
    nextNote()
  }
}
/** END METRONOME */
function moveBeats() {
  for (let i = 0; i < beatsInTransit.length; i += 1) {
    beatsInTransit[i].move(current16thNote, totalBeats)
  }
  for (let i = 0; i < beatsToHittest.length; i += 1) {
    beatsToHittest[i].move(current16thNote, totalBeats)
  }
  // for (let i = 0; i < beatsToIgnore.length; i += 1) {
  //   beatsToIgnore[i].move(current16thNote, totalBeats)
  // }
}

function movePoppers() {
  for (let i = 0; i < scorePoppers.length; i += 1) {
    scorePoppers[i].update()
  }
}

function checkForLevelSpawns(pBeat) {
  console.log('Checking for spawn on Beat #', pBeat, sectionBeats)
  for (let i = 0; i < 4; i += 1) {
    if (levels[currentLevel].data[i][sectionBeats]) {
      console.log('Spawning on Beat #', pBeat, sectionBeats)
      spawnBeat(i)
    }
  }

  const repeats = levelRepeats[sectionBeats]

  // console.log('REPEATS', repeats)

  if (repeats) {
    levelRepeats[sectionBeats] -= 1
    // sectionRepeats = levelRepeats[sectionBeats]
    sectionBeats -= beatsSinceRepeat
    beatsSinceRepeat = 0
  }
  else if (repeats === 0) {
    levelRepeats[sectionBeats] = ''
    beatsSinceRepeat = 0
    sectionBeats += 1

    console.log('A.Checking for spawns complete', sectionBeats, levelRepeats.length)

    if (sectionBeats === levelRepeats.length) {
      // console.log('SPAWNS COMPLETE!!')
      console.log('A.All spawns complete!', sectionBeats, levelRepeats.length)
      setSpawnsComplete()
    }
  }
  else {
    beatsSinceRepeat += 1
    sectionBeats += 1

    // TODO: Remove check here. Happens above now.
    console.log('B.Checking for spawns complete', sectionBeats, levelRepeats.length)

    if (sectionBeats === levelRepeats.length) {
      // console.log('SPAWNS COMPLETE!!')
      console.log('B.All spawns complete!', sectionBeats, levelRepeats.length)
      setSpawnsComplete()
    }
  }
}

function facilitateCurrentLevel() {
  scheduler()
  moveBeats()
  movePoppers()
}

function renderAnyBeats() {
  for (let i = 0; i < beatsInTransit.length; i += 1) {
    beatsInTransit[i].render()
  }
  for (let i = 0; i < beatsToHittest.length; i += 1) {
    beatsToHittest[i].render()
  }
  // for (let i = 0; i < beatsToIgnore.length; i += 1) {
  //   beatsToIgnore[i].render()
  // }
}
function renderAnyPoppers() {
  for (let i = 0; i < scorePoppers.length; i += 1) {
    scorePoppers[i].render()
  }
}

/* #endregion */

/* #region ******** DRAWING ******** */

function drawBackground() {
  drawDebugZones(context)
  drawRows(context)

  // DRAW ZONE:
  context.fillStyle = '#ffffff'
  context.strokeStyle = '#ffffff'
  context.setLineDash([4, 6])
  context.strokeRect(-2, ZONE_TOP, CANVAS_WIDTH + 4, ZONE_HEIGHT)

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

}
/* #endregion */

/* #region ******** INIT ******** */

function handleKeyboardControl(event) {
  switch (scene.id) {
    case scenes.introscene:
      if (event.code === 'Space') {
        setScene(titlescene)
      }
      break
    case scenes.titlescene:
      if (event.code === 'Space') {
        goToNextLevel()
      }
      else if (event.code === 'KeyT') {
        if (!levelStarted) {
          startLevel()
        }
      }
      else {
        playFromKeycode(event.code)
      }
      break
    case scenes.prelevelscene:
      if (event.code === 'Space') {
        setScene(gamescene)
      }
      break
    case scenes.gamescene:
      if (event.code === 'Space') {
        console.log('TODO: Implement Pause')
      }
      else {
        playFromKeycode(event.code)
      }
      break
    case scenes.postlevelscene:
      if (event.code === 'Space') {
        goToNextLevel()
      }
      if (event.code === 'KeyR') {
        replaySameLevel()
      }
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
      checkCollision(0)
      break
    case 'KeyF':
      kick.trigger(aCtx.currentTime)
      // lanesO.kick.play()
      // zzfx(...[,0,125,,.05,.25,,2.5,-0.1]) // KICK
      // zzfx(...[,0,110,,,.05,1,.8,-0.2,-0.4,,,,,,,,.5,.29])
      // zzfx(...[,0,115,,,.45,,,-0.1,-0.2,,,,,,,,.9,.1])
      // zzfx(...[,0,125,,,.5,,,-0.2,-0.1,,,,,,,,.5,.05])
      checkCollision(1)
      break
    case 'KeyJ':
      snare.trigger(aCtx.currentTime)
      // lanesO.snare.play()
      checkCollision(2)
      break
    case 'KeyK':
      hihat.trigger(aCtx.currentTime)
      // lanesO.hihat.play()
      checkCollision(3)
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
  initBeats()
  initScenes()

  // setScene(introscene)
  setScene(titlescene)
}

function getElements() {
  bgCanvas = $('#bgBoard')
  bgCtx = bgCanvas.getContext('2d')
  lCtx = $('#canvas').getContext('2d')
}

function initConstants() {
  VIEW_HEIGHT = window.innerHeight
  BOARD_HEIGHT = VIEW_HEIGHT
  // VIEW_WIDTH = window.innerWidth
  SECTION_HEIGHT = Math.floor(VIEW_HEIGHT / HORIZONTAL_SECTIONS)
  MOVE_SPEED = SECTION_HEIGHT / (FPS * TIME_PER_TICK)
  CANVAS_WIDTH = SECTION_HEIGHT * 5
  CANVAS_MIDX = CANVAS_WIDTH / 2
  // The y top coord of the hit zone

  console.log(BOARD_HEIGHT, HORIZONTAL_SECTIONS, SECTION_HEIGHT)

  ZONE_HEIGHT = SECTION_HEIGHT
  ZONE_TOP = (Math.floor(BOARD_HEIGHT / HORIZONTAL_SECTIONS) * (HORIZONTAL_SECTIONS - 2)) - (SECTION_HEIGHT / 2)
  ZONE_CHECK_TOP = ZONE_TOP - (SECTION_HEIGHT)
  ZONE_CHECK_BOTTOM = (SECTION_HEIGHT * 15.5)
  // ZONE_CHECK_MEH_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  // ZONE_CHECK_MEH_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_OK_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 1.5)))
  ZONE_CHECK_GOOD_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 3)))
  ZONE_CHECK_GOOD_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT - (SECTION_HEIGHT / 3)))
  ZONE_CHECK_PERFECT_TOP = ZONE_CHECK_TOP + Math.floor((SECTION_HEIGHT))
  ZONE_CHECK_PERFECT_BOTTOM = ZONE_CHECK_BOTTOM - Math.floor((SECTION_HEIGHT))

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

function initBeats(showKeys = false) {
  beats = [
    {
      x: BASS_X,
      image: getBeatImage('#ff5555', '#eeeeee', showKeys ? 'D' : '', false),
    },
    {
      x: KICK_X,
      image: getBeatImage('#08ff08', '#eeeeee', showKeys ? 'F' : '', false),
    },
    {
      x: SNARE_X,
      image: getBeatImage('#6600ff', '#eeeeee', showKeys ? 'J' : '', false),
    },
    {
      x: HIHAT_X,
      image: getBeatImage('#04d9ff', '#eeeeee', showKeys ? 'K' : '', false),
    },
  ]
}

function initScenes() {
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
      Text({
        x: CANVAS_MIDX,
        y: 650,
        color: COLORS.ok,
        anchor: { x: .5, y: .5 },
        text: 'TUTORIAL\n[ t ]',
        textAlign: 'center',
        font: gFont(30),
      }),
    ],
    onShow() {
      setCurrentLevel(0)
      initBeats(true)
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
    onHide() {
      clearAllBeats()
    },
    // render() {
    //   drawBackground()
    // },
  })
  gamescene = Scene({
    id: scenes.gamescene,
    children: [
      introscene.children[1],
      introscene.children[0],
      introscene.children[2],
    ],
    onShow() {
      initBeats()
      startLevel()
      this.children[1].y = 100
      this.children[1].opacity = 0
      this.children[1].color = COLORS.perfect
      this.children[1].text = `SCORE:\n${score}`
      this.children[1].font = gFont(30)
    },
  })
  prelevelscene = Scene({
    id: scenes.prelevelscene,
    children: [
      introscene.children[1],
      introscene.children[0],
      introscene.children[2],
    ],
    onShow() {
      songAudio = getNewSong(1)
      this.children[0].text = `LEVEL ${currentLevel}`
      this.children[0].color = COLORS.bad
      this.children[2].text = 'START\n[ space ]',
      this.children[0].opacity = 0
      this.children[2].opacity = 0
      this.children[1].y = 350
      this.children[1].opacity = 0
      this.children[1].color = COLORS.perfect
      this.children[1].text = 'Are you ready?'
      this.children[1].font = gFont(30)
    },
    onhide() {},
  })
  postlevelscene = Scene({
    id: scenes.postlevelscene,
    children: [
      introscene.children[1],
      introscene.children[0],
      introscene.children[2],
    ],
    onShow() {
      this.children[0].text = `LEVEL ${currentLevel}\nCOMPLETE`
      this.children[0].color = COLORS.bad
      this.children[2].text = 'NEXT\n[ space ]\n\nRETRY\n[ r ]',
      this.children[0].opacity = 0
      this.children[2].opacity = 0
      this.children[1].y = 350
      this.children[1].opacity = 0
      this.children[1].color = COLORS.perfect
      this.children[1].text = `Score:\n${score}/\n${levels[currentLevel].maxScore}`
      this.children[1].font = gFont(30)
    },
    onhide() {},
  })
  gameoverscene = Scene({
    id: scenes.gameoverscene,
    children: [
      introscene.children[1],
      introscene.children[0],
      introscene.children[2],
    ],
    onShow() {
      this.children[0].text = 'MANUAL\nREPROGRAM\nCOMPLETE'
      this.children[0].color = COLORS.bad
      this.children[2].text = '',
      this.children[0].opacity = 0
      this.children[2].opacity = 0
      this.children[1].y = 350
      this.children[1].opacity = 0
      this.children[1].color = COLORS.perfect
      this.children[1].text = 'Thank you for\nplaying!!'
      this.children[1].font = gFont(30)
    },
    onhide() {},
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
function fadeOut(el) {
  if (el.opacity > 0) {
    el.opacity = clamp(0, 1, el.opacity - .05)
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

/* #region ******** DEBUG ******** */
const drawRows = (pCtx) => {
  for (let i = 0; i < HORIZONTAL_SECTIONS; i += 1) {
    pCtx.save()
    pCtx.strokeStyle = 'blue'
    pCtx.strokeRect(0, SECTION_HEIGHT * i, CANVAS_WIDTH, SECTION_HEIGHT)
    pCtx.restore()
  }
}

function drawDebugZones(pCtx) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue']
  const zoneArr = [
    [ZONE_CHECK_TOP, ZONE_CHECK_BOTTOM],
    // [ZONE_CHECK_MEH_TOP, ZONE_CHECK_MEH_BOTTOM],
    [ZONE_CHECK_OK_TOP, ZONE_CHECK_OK_BOTTOM],
    [ZONE_CHECK_GOOD_TOP, ZONE_CHECK_GOOD_BOTTOM],
    [ZONE_CHECK_PERFECT_TOP, ZONE_CHECK_PERFECT_BOTTOM],
  ]

  zoneArr.forEach(([top, bottom], i) => {
    const x = 50 + (4 * (i + 1))
    const y = top

    pCtx.fillStyle = colors[i]
    pCtx.fillRect(x, y, 4, bottom - top)
  })
}
/* #endregion */
