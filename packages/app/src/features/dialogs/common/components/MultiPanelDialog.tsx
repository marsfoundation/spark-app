import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

interface ActionViewWrapperProps {
  children: ReactNode
  panelRef?: React.Ref<HTMLDivElement>
  className?: string
}

export function MultiPanelDialog({ children, panelRef, className }: ActionViewWrapperProps) {
  return (
    <div ref={panelRef} className={cn('flex max-w-xl flex-col gap-4', className)}>
      {children}
    </div>
  )
}
