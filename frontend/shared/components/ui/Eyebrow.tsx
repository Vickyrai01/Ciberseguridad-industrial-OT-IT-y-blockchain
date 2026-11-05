import type { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  pulse?: boolean
  className?: string
}

export function Eyebrow({ children, pulse = false, className = '' }: EyebrowProps) {
  return (
    <span className={`eyebrow${className ? ` ${className}` : ''}`}>
      {pulse && <span className="pulse-dot" />}
      {children}
    </span>
  )
}
