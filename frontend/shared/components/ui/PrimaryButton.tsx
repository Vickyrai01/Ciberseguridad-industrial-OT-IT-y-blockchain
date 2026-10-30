import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function PrimaryButton({ children, className = '', type = 'button', ...props }: PrimaryButtonProps) {
  return (
    <button type={type} className={`primary-btn${className ? ` ${className}` : ''}`} {...props}>
      {children}
    </button>
  )
}
