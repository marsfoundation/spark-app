import { cn } from '@/ui/utils/style'

export const AVAILABLE_TIMEFRAMES = ['7D', '1M', '1Y', 'All'] as const

export interface TimeframeButtonsProps {
  setSelectedTimeframe: (timeframe: (typeof AVAILABLE_TIMEFRAMES)[number]) => void
  selectedTimeframe: (typeof AVAILABLE_TIMEFRAMES)[number]
}

export function TimeframeButtons({ setSelectedTimeframe, selectedTimeframe }: TimeframeButtonsProps) {
  return (
    <div className="flex w-fit rounded-lg border border-basics-border">
      {AVAILABLE_TIMEFRAMES.map((timeframe) => (
        <TimeframeButton
          key={timeframe}
          selected={selectedTimeframe === timeframe}
          onClick={() => setSelectedTimeframe(timeframe)}
        >
          {timeframe}
        </TimeframeButton>
      ))}
    </div>
  )
}

interface TimeframeButtonProps {
  onClick?: () => void
  selected?: boolean
  children: React.ReactNode
}

function TimeframeButton({ selected, ...props }: TimeframeButtonProps) {
  return (
    <button
      className={cn(
        'h-8 gap-1 rounded-none px-3 py-2 text-xs',
        'font-normal text-prompt-foreground hover:bg-basics-grey hover:text-black',
        'last:rounded-r-lg first:rounded-l-lg',
        selected && 'bg-basics-grey text-black',
      )}
      {...props}
    />
  )
}
