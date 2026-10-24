import { useCallback } from 'react'

export type SoundEffect = 'click' | 'alert' | 'success'

export function useSound(enabled: boolean) {
  const beep = useCallback(
    (kind: SoundEffect) => {
      if (!enabled) return
      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.frequency.value = kind === 'alert' ? 130 : kind === 'success' ? 540 : 300
      gain.gain.value = 0.045
      oscillator.start()
      oscillator.stop(context.currentTime + 0.09)
    },
    [enabled],
  )

  return { beep }
}
