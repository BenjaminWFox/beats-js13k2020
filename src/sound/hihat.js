function HiHat(c) {
  this.c = c
  this.fundamental = 40
  this.ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]
}

HiHat.prototype.setup = function () {
  this.g = this.c.createGain()

  // bandpass
  this.b = this.c.createBiquadFilter()
  this.b.type = 'bandpass'
  this.b.frequency.value = 10000

  // highpass
  this.h = this.c.createBiquadFilter()

  this.h.type = 'highpass'
  this.h.frequency.value = 7000

  // Connect the graph
  this.b.connect(this.h)
  this.h.connect(this.g)
  this.g.connect(this.c.destination)
}

// Create the oscillators
HiHat.prototype.trigger = function (time) {
  this.setup()

  this.ratios.forEach((ratio) => {
    const osc = this.c.createOscillator()

    osc.type = 'square'
    // Frequency is the fundamental * this oscillator's ratio
    osc.frequency.value = this.fundamental * ratio
    osc.connect(this.b)
    osc.start(time)
    osc.stop(time + 0.5)
  })

  // Define the volume envelope
  this.g.gain.setValueAtTime(0.00001, time)
  this.g.gain.exponentialRampToValueAtTime(1, time + 0.02)
  this.g.gain.exponentialRampToValueAtTime(0.3, time + 0.08)
  this.g.gain.exponentialRampToValueAtTime(0.00001, time + 0.5)
}

export default HiHat
