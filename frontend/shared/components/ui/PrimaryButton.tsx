import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoadingButton } from './LoadingButton'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  loadingLabel?: ReactNode
}

export function PrimaryButton({ children, loading, loadingLabel, ...props }: PrimaryButtonProps) {
  return (
    <LoadingButton {...props} loading={loading} loadingLabel={loadingLabel} variant="primary">
      {children}
    </LoadingButton>
  )
}
