function Ticker(context, onTick) {
  this.context = context
  this.onTick = onTick
  // this.onUpdate = onUpdate
  this.curTime = context.currentTime
  this.running = true

  // Ticking every 16th note:
  this.tickEvery = 16
  // BPM in Quarter Notes
  this.bpm = 120
  // How often to tick, in ms
  this.timePerTick = 60.0 / (this.tickEvery / 4) / this.bpm

  // How often to play metronome tone?
  // Notes from 16th to whole: 16 / 8 / 4 / 2 / 1
  this.toneEvery = 4
  this.ticksSinceNote = 0

  this.curTime = 0.0
  this.renderTime = 0.0

  this.maxTicks = Infinity
  this.totalTicks = 0
  this.running = false

  this.ticksPerNote = this.tickEvery / this.toneEvery

}

// Ticker.prototype.update = function () {
//   this.onUpdate()
// }

Ticker.prototype.start = function () {
  this.running = true
  this.schedule()
}

Ticker.prototype.schedule = function () {
  while (this.curTime < this.context.currentTime + 0.1) {
    console.log('Running tick')
    this.onTick(this.totalTicks)

    if (this.ticksSinceNote === 0) {
      // this.playNote(this.curTime)
    }

    this.ticksSinceNote += 1

    if (this.ticksPerNote === this.ticksSinceNote) {
      this.ticksSinceNote = 0
    }

    this.totalTicks += 1
    this.updateTime()
  }

  if (this.totalTicks === this.maxTicks) {
    this.stop()
  }

  if (this.running) {
    this.timer = setTimeout(this.schedule.bind(this), 0.1)
  }
}

Ticker.prototype.stop = function () {
  console.log('Stopping...')
  this.running = false
  clearTimeout(this.timer)
  cancelAnimationFrame(this.renderer)
}

Ticker.prototype.updateTime = function () {
  // console.log('updateTime', this.timePerTick)
  // Convert BPM into 16th notes
  this.curTime += this.timePerTick
}

// Ticker.prototype.updateRenderTime = function () {
//   this.animateTime += this.timePerTick / this.tickEvery
// }

/* Play note on a delayed interval of t */
Ticker.prototype.playNote = function (t) {
  const note = this.context.createOscillator()
  const noteEnvelope = this.context.createGain()

  noteEnvelope.gain.value = .05

  note.connect(noteEnvelope)
  noteEnvelope.connect(this.context.destination)

  note.start(t)
  note.stop(t + 0.05)
}

export default Ticker

// // window.AudioContext = window.AudioContext || window.webkitAudioContext
// let context
// let timer

// // Ticking every 16th note:
// const tickEvery = 16
// // BPM in Quarter Notes
// const bpm = 120
// // How often to tick, in ms
// const timePerTick = 60.0 / (tickEvery / 4) / bpm

// // How often to play metronome tone?
// // Notes from 16th to whole: 16 / 8 / 4 / 2 / 1
// const toneEvery = 16
// let ticksSinceNote = 0

// let curTime = 0.0

// const maxTicks = 60
// let totalTicks = 0
// let running = false
// let onTick

// const ticksPerNote = tickEvery / toneEvery

// /**
//  * ADAPTED FROM:
//  *
//  * https://codepen.io/ganderzz/pen/Ezlfu
//  */
// /*
// Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
// */
// function schedule() {
//   while (curTime < context.currentTime + 0.1) {
//     onTick(totalTicks)

//     if (ticksSinceNote === 0) {
//       playNote(curTime)
//     }

//     ticksSinceNote += 1

//     if (ticksPerNote === ticksSinceNote) {
//       ticksSinceNote = 0
//     }

//     totalTicks += 1
//     updateTime()
//   }

//   if (totalTicks === maxTicks) {
//     stop()
//   }

//   if (running) {
//     timer = setTimeout(schedule, 0.1)
//   }
// }

// function stop() {
//   console.log('Stopping...')
//   running = false
//   clearTimeout(timer)
// }

// function updateTime() {
//   console.log('updateTime', timePerTick)
//   // Convert BPM into 16th notes
//   curTime += timePerTick
// }

// /* Play note on a delayed interval of t */
// function playNote(t) {
//   const note = context.createOscillator()
//   const noteEnvelope = context.createGain()

//   noteEnvelope.gain.value = .05

//   note.connect(noteEnvelope)
//   noteEnvelope.connect(context.destination)

//   note.start(t)
//   note.stop(t + 0.05)
// }

// export default function start(pContext, pOnTick) {
//   console.log('Start...')
//   context = pContext
//   curTime = pContext.currentTime
//   running = true
//   onTick = pOnTick

//   schedule()
// }
