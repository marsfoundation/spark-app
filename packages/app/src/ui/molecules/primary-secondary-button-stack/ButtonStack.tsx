import { Button } from '@/ui/atoms/button/Button'
import { ReactNode } from 'react'

type ButtonProps = {
  text: string
  onClickAction: () => void
  header?: string
  prefixIcon?: ReactNode
  postfixIcon?: ReactNode
}

export interface ButtonStackProps {
  primaryButton: ButtonProps
  secondaryButton: ButtonProps
}

export function ButtonStack({ primaryButton, secondaryButton }: ButtonStackProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 text-center font-semibold text-base text-basics-black sm:text-xl">
        {primaryButton.header}
        <Button {...primaryButton}>{primaryButton.text}</Button>
      </div>
      <div className="flex flex-col gap-3 text-center text-basics-dark-grey text-sm sm:text-base">
        {secondaryButton.header}
        <Button {...secondaryButton} variant="secondary">
          {secondaryButton.text}
        </Button>
      </div>
    </div>
  )
}
