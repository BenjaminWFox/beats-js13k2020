import './main.scss'
import Kick from './sound/kick'
import Snare from './sound/snare'
import HiHat from './sound/hihat'

const timeEl = document.getElementById('time')

const AudioContext = window.AudioContext || window.webkitAudioContext

const ctx = new AudioContext()

const kick = new Kick(ctx)
const snare = new Snare(ctx)
const hihat = new HiHat(ctx)

const btn1 = document.getElementById('b1')
const btn2 = document.getElementById('b2')
const btn3 = document.getElementById('b3')
const btn4 = document.getElementById('b4')

let time = 0

function repeatOften() {
  time += 1
  timeEl.innerHTML = ctx.currentTime

  if (time % 100 === 0) {
    // console.log('Fire')
    // playBass()
  }

  // Do whatever
  requestAnimationFrame(repeatOften)
}

// requestAnimationFrame(repeatOften)

btn1.addEventListener('click', (e) => {
  kick.trigger(ctx.currentTime)
  kick.trigger(ctx.currentTime)
})

btn2.addEventListener('click', (e) => {
  kick.trigger(ctx.currentTime)
})

btn3.addEventListener('click', (e) => {
  snare.trigger(ctx.currentTime)
})

btn4.addEventListener('click', (e) => {
  hihat.trigger(ctx.currentTime)
})

document.addEventListener('keydown', (e) => {
  switch (event.key) {
    case 'd':
      kick.trigger(ctx.currentTime)
      kick.trigger(ctx.currentTime)
      break
    case 'f':
      kick.trigger(ctx.currentTime)
      break
    case 'j':
      snare.trigger(ctx.currentTime)
      break
    case 'k':
      // hihat2(ctx)
      hihat.trigger(ctx.currentTime)
      break
    default:
      return
  }
})

