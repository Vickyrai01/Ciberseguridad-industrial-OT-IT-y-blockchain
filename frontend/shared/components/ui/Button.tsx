import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  loadingLabel?: ReactNode
  variant?: 'primary' | 'secondary' | 'text'
}

export function Button({
  children,
  className = '',
  disabled,
  loading = false,
  loadingLabel,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const buttonClassName = `${variant}-btn action-btn${loading ? ' action-btn-loading' : ''}${className ? ` ${className}` : ''}`

  return (
    <button type={type} className={buttonClassName} disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading && <LoaderCircle className="action-btn-loader" size={16} aria-hidden="true" />}
      {loading ? (loadingLabel ?? children) : children}
    </button>
  )
}
