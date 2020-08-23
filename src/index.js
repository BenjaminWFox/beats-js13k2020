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

/* #region ******** CONSTANTS & GLOBAL VARS ******** */
const TICK_EVERY = 16
const FPS = 60
const BPM = 120
const TIME_PER_TICK = 60.0 / (TICK_EVERY / 4) / BPM
const TIME_PER_RENDER = TIME_PER_TICK / (TICK_EVERY / 2)
const COUNTS_PER_MEASURE = 16
const HORIZONTAL_SECTIONS = COUNTS_PER_MEASURE
let VIEW_HEIGHT
let VIEW_WIDTH
let SECTION_HEIGHT
let BOARD_HEIGHT

let canvas
let ctx
let bgCanvas
let bgCtx
/* #endregion */

/* #region ******** ALIASES & CONVENIENCE ******** */

const $ = document.querySelector.bind(document)

const convertPx = (n) => `${n}px`

/* #endregion */

window.addEventListener('load', () => {
  init()
})

function init() {
  getElements()
  initConstants()
  initUi()
}

function getElements() {
  canvas = $('#board')
  ctx = canvas.getContext('2d')
  bgCanvas = $('#bgBoard')
  bgCtx = bgCanvas.getContext('2d')
}

function initConstants() {
  VIEW_HEIGHT = window.innerHeight
  VIEW_WIDTH = window.innerWidth
  SECTION_HEIGHT = Math.floor(VIEW_HEIGHT / HORIZONTAL_SECTIONS)
}

function initUi() {
  $('#body').style.height = `${VIEW_HEIGHT}px`
  canvas.height = VIEW_HEIGHT
  bgCanvas.height = VIEW_HEIGHT
  canvas.width = SECTION_HEIGHT * 5
  bgCanvas.width = SECTION_HEIGHT * 5
}
