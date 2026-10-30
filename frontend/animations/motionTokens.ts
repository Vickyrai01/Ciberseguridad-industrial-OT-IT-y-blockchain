import type { Transition } from 'framer-motion'

export const animationDuration = {
  fast: 0.18,
  base: 0.24,
  slow: 0.42,
} as const

export const animationEase = {
  standard: [0.22, 1, 0.36, 1],
  emphasis: [0.16, 1, 0.3, 1],
} as const

export const pageTransition: Transition = {
  duration: animationDuration.slow,
  ease: animationEase.emphasis,
}

export const briefingTransition: Transition = {
  duration: animationDuration.base,
  ease: animationEase.standard,
}

export const eventTransition: Transition = {
  duration: animationDuration.fast,
  ease: animationEase.standard,
}

export const pageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const briefingMotion = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

export const eventMotion = {
  initial: { opacity: 0, x: -5 },
  animate: { opacity: 1, x: 0 },
}
