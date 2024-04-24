import { assets } from '@/ui/assets'

import { Button, ButtonProps } from '../../atoms/button/Button'

export interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean
  isDone?: boolean
}

export function ActionButton({ isLoading, isDone, children, ...props }: ActionButtonProps) {
  const disabled = props.disabled || isLoading

  return (
    <Button {...props} disabled={disabled}>
      {children}
      {isLoading && <img src={assets.threeDots} alt="loader" width={20} height={5} data-chromatic="ignore" />}
      {isDone && <span>✓</span>}
    </Button>
  )
}
