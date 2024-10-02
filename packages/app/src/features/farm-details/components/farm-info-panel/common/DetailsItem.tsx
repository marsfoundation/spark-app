import { ReactNode } from 'react'

export interface DetailsItemProps {
  title: string
  explainer?: ReactNode
  children: ReactNode
}
export function DetailsItem({ title, explainer, children }: DetailsItemProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-1 md:w-fit md:flex-col md:items-start md:justify-normal">
      <div className="flex flex-row items-center gap-1 text-prompt-foreground text-xs">
        {title}
        {explainer}
      </div>
      <div>{children}</div>
    </div>
  )
}
