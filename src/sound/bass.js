
function Bass(context) {
  this.context = context
}

Bass.prototype.setup = function () {
  this.osc = this.context.createOscillator()
  this.gain = this.context.createGain()
  this.osc.connect(this.gain)
  this.gain.connect(this.context.destination)
}

Bass.prototype.trigger = function (time) {
  this.setup()

  this.osc.frequency.setValueAtTime(100, time)
  this.gain.gain.setValueAtTime(1, time)

  this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 1.25)
  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 1.25)

  this.osc.start(time)

  this.osc.stop(time + 1)
}

export default Bass
