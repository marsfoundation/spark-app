import { Circle } from 'lucide-react'
import { ReactNode } from 'react'

export function ChartTooltipContent({ children: [date, value] }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-sm bg-primary-inverse p-3">
      {date}
      {value}
    </div>
  )
}

function TooltipDate({ children }: { children: ReactNode }) {
  return <div className="typography-label-6 flex flex-col gap-3 text-secondary">{children}</div>
}

function TooltipValue({ children, dotColor }: { children: ReactNode; dotColor: string }) {
  return (
    <div className="typography-label-4 flex items-center gap-1.5 text-primary-inverse">
      <Circle size={8} fill={dotColor} stroke="0" />
      <div>{children}</div>
    </div>
  )
}

ChartTooltipContent.Date = TooltipDate
ChartTooltipContent.Value = TooltipValue
