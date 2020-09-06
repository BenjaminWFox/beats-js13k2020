
function Bass(c) {
  this.c = c
}

Bass.prototype.setup = function () {
  this.o = this.c.createOscillator()
  this.g = this.c.createGain()
  this.o.connect(this.g)
  this.g.connect(this.c.destination)
}

Bass.prototype.trigger = function (time) {
  this.setup()

  this.o.frequency.setValueAtTime(100, time)
  this.g.gain.setValueAtTime(1, time)

  this.o.frequency.exponentialRampToValueAtTime(0.01, time + 1.25)
  this.g.gain.exponentialRampToValueAtTime(0.01, time + 1.25)

  this.o.start(time)

  this.o.stop(time + 1)
}

export default Bass
