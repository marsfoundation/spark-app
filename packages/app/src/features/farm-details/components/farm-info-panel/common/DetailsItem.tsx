import { cn } from '@/ui/utils/style'
import { ReactNode } from 'react'

export interface DetailsItemProps {
  title: string
  explainer?: ReactNode
  children: ReactNode
}
export function DetailsItem({ title, explainer, children }: DetailsItemProps) {
  return (
    <div className="flex flex-col gap-1 px-3 xl:px-6 last:pr-0 first:pl-0">
      <div
        className={cn(
          'typography-label-4 md:typography-label-3 lg:typography-label-2',
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
