export default function hihat(context) {
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]
  const fundamental = 40
  const when = context.currentTime

  const gain = context.createGain()

  // Bandpass
  const bandpass = context.createBiquadFilter()

  bandpass.type = 'bandpass'
  bandpass.frequency.value = 10000

  // highpass
  const highpass = context.createBiquadFilter()

  highpass.type = 'highpass'
  highpass.frequency.value = 7000

  // connect to the graph
  bandpass.connect(highpass)
  highpass.connect(gain)
  gain.connect(context.destination)

  // Create oscillators
  ratios.map((ratio) => {
    const osc = context.createOscillator()

    osc.type = 'square'
    osc.frequency.value = fundamental * ratio
    osc.connect(bandpass)
    osc.start(when)
    osc.stop(when + 0.5)
  })

  // Define the volume envelope
  gain.gain.setValueAtTime(0.00001, when)
  // gain.gain.setValueAtTime(1, when)
  gain.gain.exponentialRampToValueAtTime(1, when + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.3, when + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.5)
}
