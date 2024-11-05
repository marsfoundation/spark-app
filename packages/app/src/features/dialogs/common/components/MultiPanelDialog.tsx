import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

interface ActionViewWrapperProps {
  children: ReactNode
  panelRef?: React.Ref<HTMLDivElement>
  className?: string
}

export function MultiPanelDialog({ children, panelRef, className }: ActionViewWrapperProps) {
  return (
    <div ref={panelRef} className={cn('flex flex-col gap-4 sm:gap-8', className)}>
      {children}
    </div>
  )
}
