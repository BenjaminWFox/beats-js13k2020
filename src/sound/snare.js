function Snare(c) {
  // c is for context
  this.c = c
}

Snare.prototype.nb = function () {
  const bS = this.c.sampleRate
  const b = this.c.createBuffer(1, bS, this.c.sampleRate)
  const o = b.getChannelData(0)

  for (let i = 0; i < bS; i++) {
    o[i] = (Math.random() * 2) - 1
  }

  return b
}

Snare.prototype.setup = function () {
  this.n = this.c.createBufferSource()
  this.n.buffer = this.nb()
  const nF = this.c.createBiquadFilter()

  nF.type = 'highpass'
  nF.frequency.value = 1000
  this.n.connect(nF)
  // …

  this.nE = this.c.createGain()
  nF.connect(this.nE)

  this.nE.connect(this.c.destination)

  // ...
  this.o = this.c.createOscillator()
  this.o.type = 'triangle'

  this.oE = this.c.createGain()
  this.o.connect(this.oE)
  this.oE.connect(this.c.destination)
}

Snare.prototype.trigger = function (time) {
  this.setup()

  this.nE.gain.setValueAtTime(.5, time)
  this.nE.gain.exponentialRampToValueAtTime(0.01, time + 0.2)
  this.n.start(time)

  this.o.frequency.setValueAtTime(100, time)
  this.oE.gain.setValueAtTime(0.7, time)
  this.oE.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
  this.o.start(time)

  this.o.stop(time + 0.2)
  this.n.stop(time + 0.2)
}

export default Snare
