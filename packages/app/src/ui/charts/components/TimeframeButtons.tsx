import { cn } from '@/ui/utils/style'
import { AVAILABLE_TIMEFRAMES, Timeframe } from '../defaults'

export interface TimeframeButtonsProps {
  onTimeframeChange: (timeframe: Timeframe) => void
  selectedTimeframe: Timeframe
}

export function TimeframeButtons({ onTimeframeChange, selectedTimeframe }: TimeframeButtonsProps) {
  return (
    <div className="ml-auto grid w-full grid-cols-4 rounded-lg border border-basics-border">
      {AVAILABLE_TIMEFRAMES.map((timeframe) => (
        <TimeframeButton
          key={timeframe}
          selected={selectedTimeframe === timeframe}
          onClick={() => onTimeframeChange(timeframe)}
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
        // radius has to be calculated because of the border of wrapper - more details https://www.30secondsofcode.org/css/s/nested-border-radius/
        'last:rounded-r-[calc(var(--radius)-1px)] first:rounded-l-[calc(var(--radius)-1px)]',
        selected && 'bg-basics-grey text-black',
      )}
      {...props}
    />
  )
}
