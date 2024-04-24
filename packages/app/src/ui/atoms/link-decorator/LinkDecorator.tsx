import { Slot } from '@radix-ui/react-slot'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface LinkDecoratorProps {
  children: ReactNode
  to: string
  external?: boolean
}

export function LinkDecorator({ children, to, external }: LinkDecoratorProps) {
  const navigate = useNavigate()

  function onClick() {
    if (external) {
      window.open(to, '_blank')
    } else {
      navigate(to)
    }
  }

  return (
    <Slot onClick={onClick} className="cursor-pointer">
      {children}
    </Slot>
  )
}
