import { Circle } from 'lucide-react'
import { ReactNode } from 'react'

export function ChartTooltipContent({ children: [date, value] }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-700/10 bg-white p-3 shadow">
      {date}
      {value}
    </div>
  )
}

function TooltipDate({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 text-slate-500 text-xs leading-none">{children}</div>
}

function TooltipValue({ children, dotColor }: { children: ReactNode; dotColor: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm leading-none">
      <Circle size={8} fill={dotColor} stroke="0" />
      <div>{children}</div>
    </div>
  )
}

ChartTooltipContent.Date = TooltipDate
ChartTooltipContent.Value = TooltipValue
