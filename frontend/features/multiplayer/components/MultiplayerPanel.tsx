import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageMotion, pageTransition } from '../../../animations/motionTokens'

interface MultiplayerPanelProps {
  children: ReactNode
  variant?: 'default' | 'entry'
}

export function MultiplayerPanel({ children, variant = 'default' }: MultiplayerPanelProps) {
  return (
    <motion.main
      className={`multiplayer-page multiplayer-page-${variant} ot-layout-screen`}
      {...pageMotion}
      transition={pageTransition}>
      <section className={`multiplayer-panel multiplayer-panel-${variant}`}>{children}</section>
    </motion.main>
  )
}
