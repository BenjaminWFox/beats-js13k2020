function HiHat(context) {
  this.context = context
  this.fundamental = 40
  this.ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]
}

HiHat.prototype.setup = function () {
  this.gain = this.context.createGain()

  // Bandpass
  this.bandpass = this.context.createBiquadFilter()
  this.bandpass.type = 'bandpass'
  this.bandpass.frequency.value = 10000

  // Highpass
  this.highpass = this.context.createBiquadFilter()

  this.highpass.type = 'highpass'
  this.highpass.frequency.value = 7000

  // Connect the graph
  this.bandpass.connect(this.highpass)
  this.highpass.connect(this.gain)
  this.gain.connect(this.context.destination)
}

// Create the oscillators
HiHat.prototype.trigger = function (time) {
  this.setup()

  this.ratios.forEach((ratio) => {
    const osc = this.context.createOscillator()

    osc.type = 'square'
    // Frequency is the fundamental * this oscillator's ratio
    osc.frequency.value = this.fundamental * ratio
    osc.connect(this.bandpass)
    osc.start(time)
    osc.stop(time + 0.5)
  })

  // Define the volume envelope
  this.gain.gain.setValueAtTime(0.00001, time)
  this.gain.gain.exponentialRampToValueAtTime(1, time + 0.02)
  this.gain.gain.exponentialRampToValueAtTime(0.3, time + 0.08)
  this.gain.gain.exponentialRampToValueAtTime(0.00001, time + 0.5)
}

export default HiHat
