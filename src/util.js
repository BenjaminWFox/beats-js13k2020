/**
   * calc fps
   */
let lastCalledTime
let fps = 0
let delta

export function calcFps(displayEl) {
  if (!lastCalledTime) {
    console.log('fps')
    lastCalledTime = performance.now()

    fps = 0
  }
  else {
    delta = (performance.now() - lastCalledTime) / 1000

    lastCalledTime = performance.now()

    fps = Math.round((1 / delta))
    displayEl.innerHTML = fps
  }
}
