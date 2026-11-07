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
      className={`multiplayer-page multiplayer-page-${variant} multiplayer-page-layout ot-layout-screen`}
      {...pageMotion}
      transition={pageTransition}>
      <section
        className={`multiplayer-panel multiplayer-panel-${variant} multiplayer-panel-layout multiplayer-panel-layout-${variant}`}>
        {children}
      </section>
    </motion.main>
  )
}
