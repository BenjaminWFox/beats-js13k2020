
function Kick(c) {
  this.c = c
}

Kick.prototype.setup = function () {
  this.o = this.c.createOscillator()
  this.g = this.c.createGain()
  this.o.connect(this.g)
  this.g.connect(this.c.destination)
}

Kick.prototype.trigger = function (time) {
  this.setup()

  this.o.frequency.setValueAtTime(200, time)
  this.g.gain.setValueAtTime(.75, time)

  this.o.frequency.exponentialRampToValueAtTime(0.01, time + 1.25)
  this.g.gain.exponentialRampToValueAtTime(0.01, time + 1.25)

  this.o.start(time)

  this.o.stop(time + 1.25)
}

export default Kick
