import { ReactNode } from 'react'

interface ActionsCellWrapperProps {
  children: ReactNode
}

export function ActionsCell({ children }: ActionsCellWrapperProps) {
  return (
    <div
      className="mt-4 flex justify-end md:mt-0"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="flex w-full gap-2 md:w-40">{children}</div>
    </div>
  )
}
