import { Button, ButtonProps } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'

export function CardButton({ children, ...props }: Omit<ButtonProps, 'variant' | 'size'>) {
  return (
    <Button
      {...props}
      variant="secondary"
      className={cn(
        'before:bg-gradient-savings-opportunity-button',
        'before:-z-10 before:absolute before:inset-0 before:transition-all',
        'active:before:brightness-[80%] hover:before:brightness-90',
        'focus-visible:bg-gradient-to-r focus-visible:from-base-white',
        'focus-visible:to-base-white',
      )}
      size="l"
    >
      {children}
    </Button>
  )
}
