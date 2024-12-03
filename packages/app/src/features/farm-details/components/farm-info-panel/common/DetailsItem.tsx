import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

export interface DetailsItemProps {
  title: string
  explainer?: ReactNode
  children: ReactNode
}
export function DetailsItem({ title, explainer, children }: DetailsItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'typography-label-6 md:typography-label-5 lg:typography-label-4',
          'flex flex-row items-center gap-1 text-secondary',
        )}
      >
        {title}
        {explainer}
      </div>
      <div>{children}</div>
    </div>
  )
}
