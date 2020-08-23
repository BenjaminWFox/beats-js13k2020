/* #region ******** IMPORTS ******** */

import './main.scss'
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

/* #endregion */

/* #region DRAWING */

function drawBackground() {
  console.log('bg draw', ZONE_TOP, CANVAS_WIDTH, SECTION_HEIGHT)
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
function startGameWhenReady() {
  if (loadedLevels === levels.length) {
    // START FIRST THING HERE
    initGame()
    loop = gl()
    loop.start()
  }
  else {
    setTimeout(startGameWhenReady, 250)
  }
}

window.addEventListener('load', () => {
  ({ canvas, context } = initKontra('board'))

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
        y: 250,
        anchor: { x: 0.5, y: 0.5 },
        textAlign: 'center',
        font: gFont(40),
      }),
      Text({
        text: 'GRAPHICS',
        color: COLORS.perfect,
        x: CANVAS_MIDX,
        y: 310,
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
      introscene.children[2],
    ],
    onShow() {
      this.children[0].text = introStrings[5]
      this.children[0].color = COLORS.bad
      this.children[1].text = 'START\n[ space ]',
      this.children[0].opacity = 0
      this.children[1].opacity = 0
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
