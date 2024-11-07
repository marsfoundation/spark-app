import { Button, ButtonProps } from '@/ui/atoms/new/button/Button'

export interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean
  isDone?: boolean
}

export function ActionButton({ isLoading, isDone, children, ...props }: ActionButtonProps) {
  const disabled = props.disabled || isLoading

  return (
    <Button {...props} disabled={disabled}>
      {children}
      {isDone && <span>✓</span>}
    </Button>
  )
}
