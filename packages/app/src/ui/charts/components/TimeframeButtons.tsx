import { cn } from '@/ui/utils/style'
import { Timeframe } from '../defaults'

export interface TimeframeButtonsProps {
  onTimeframeChange: (timeframe: Timeframe) => void
  selectedTimeframe: Timeframe
  availableTimeframes: Timeframe[]
  className?: string
}

// @todo this should be build with SegmentControl component
export function TimeframeButtons({
  onTimeframeChange,
  selectedTimeframe,
  availableTimeframes,
  className,
}: TimeframeButtonsProps) {
  return (
    <div className={cn('ml-auto flex flex-nowrap gap-0.5 rounded-sm bg-secondary p-0.5', className)}>
      {availableTimeframes.map((timeframe) => (
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
        'typography-label-4 border border-transparent p-1.5 text-secondary xl:min-w-9 ',
        'flex-1 rounded-[6px] transition-colors ease-in hover:bg-tertiary',
        'focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-0',
        selected && 'border-primary bg-primary text-primary shadow-xs hover:bg-primary',
      )}
      {...props}
    />
  )
}
