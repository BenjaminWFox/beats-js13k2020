let audioContext = null
let unlocked = false
let isPlaying = false // Are we currently playing?
let startTime // The start time of the entire sequence.
let current16thNote // What note is currently last scheduled?
const tempo = 120.0 // tempo (in beats per minute)
const lookahead = 25.0 // How frequently to call scheduling function
// (in milliseconds)
const scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps
// with next interval (in case the timer is late)
let nextNoteTime = 0.0 // when the next note is due.
const noteResolution = 0 // 0 == 16th, 1 == 8th, 2 == quarter note
const noteLength = 0.05 // length of "beep" (in seconds)
let canvas // the canvas element
let canvasContext // canvasContext is the canvas' context 2D
let last16thNoteDrawn = -1 // the last "box" we drew on the screen
const notesInQueue = [] // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
let timerWorker = null // The Web Worker used to fire timer messages

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
}())

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
  const osc = audioContext.createOscillator()

  osc.connect(audioContext.destination)
  if (beatNumber % 16 === 0) // beat 0 == high pitch
  {
    osc.frequency.value = 880.0
  }
  else if (beatNumber % 4 === 0) // quarter notes = medium pitch
  {
    osc.frequency.value = 440.0
  }
  else // other 16th notes = low pitch
  {
    osc.frequency.value = 220.0
  }

  osc.start(time)
  osc.stop(time + noteLength)
}

function scheduler() {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime)
    nextNote()
  }
}

function play() {
  if (!unlocked) {
    // play silent buffer to unlock the audio
    const buffer = audioContext.createBuffer(1, 1, 22050)
    const node = audioContext.createBufferSource()

    node.buffer = buffer
    node.start(0)
    unlocked = true
  }

  isPlaying = !isPlaying

  if (isPlaying) { // start playing
    current16thNote = 0
    nextNoteTime = audioContext.currentTime
    timerWorker.postMessage('start')

    return 'stop'
  }
  timerWorker.postMessage('stop')

  return 'play'

}

function resetCanvas(e) {
  // resize the canvas - but remember - this clears the canvas too.
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // make sure we scroll to the top left.
  window.scrollTo(0, 0)
}

function draw() {
  let currentNote = last16thNoteDrawn
  const currentTime = audioContext.currentTime

  while (notesInQueue.length && notesInQueue[0].time < currentTime) {
    currentNote = notesInQueue[0].note
    notesInQueue.splice(0, 1) // remove note from queue
  }

  // We only need to draw if the note has moved.
  if (last16thNoteDrawn != currentNote) {
    const x = Math.floor(canvas.width / 18)

    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < 16; i++) {
      canvasContext.fillStyle = (currentNote == i) ?
        ((currentNote % 4 === 0) ? 'red' : 'blue') : 'black'
      canvasContext.fillRect(x * (i + 1), x, x / 2, x / 2)
    }
    last16thNoteDrawn = currentNote
  }

  // set up to draw again
  requestAnimFrame(draw)
}

function init() {
  const container = document.createElement('div')

  container.className = 'container'
  canvas = document.createElement('canvas')
  canvasContext = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(container)
  container.appendChild(canvas)
  canvasContext.strokeStyle = '#ffffff'
  canvasContext.lineWidth = 2

  // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
  // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
  // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
  // spec-compliant, and work on Chrome, Safari and Firefox.

  audioContext = new AudioContext()

  // if we wanted to load audio files, etc., this is where we should do it.

  window.onorientationchange = resetCanvas
  window.onresize = resetCanvas

  requestAnimFrame(draw) // start the drawing loop.

  timerWorker = new Worker('js/metronomeworker.js')

  timerWorker.onmessage = function (e) {
    if (e.data == 'tick') {
      // console.log("tick!");
      scheduler()
    }
    else {
      console.log(`message: ${ e.data}`)
    }
  }
  timerWorker.postMessage({ interval: lookahead })
}

window.addEventListener('load', init)
