import { ReactNode } from 'react'

interface ActionViewWrapperProps {
  children: ReactNode
  panelRef?: React.Ref<HTMLDivElement>
}

export function MultiPanelDialog({ children, panelRef }: ActionViewWrapperProps) {
  return (
    <div ref={panelRef} className="flex max-w-xl flex-col gap-4">
      {children}
    </div>
  )
}
