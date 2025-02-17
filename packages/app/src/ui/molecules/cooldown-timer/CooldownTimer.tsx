import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'
import { useTimestamp } from '@/utils/useTimestamp'
import { TimerResetIcon } from 'lucide-react'

interface CooldownTimerProps {
  renewalPeriod: number
  latestUpdateTimestamp: number
  cooldownOverContent?: React.ReactNode
  cooldownActiveContent?: React.ReactNode
  /**
   * @warning This prop is only for storybook purposes.
   */
  forceOpen?: boolean
}

export function CooldownTimer(props: CooldownTimerProps) {
  const { timestamp } = useTimestamp({
    refreshIntervalInMs: 1000,
  })
  const { renewalPeriod, latestUpdateTimestamp, forceOpen } = props
  const timeLeft = Math.max(0, renewalPeriod - (timestamp - latestUpdateTimestamp))
  const cooldownOverContent = props.cooldownOverContent ?? (
    <>
      The cap renewal cooldown is over. <br /> It might be changed at any time.
    </>
  )
  const cooldownActiveContent = props.cooldownActiveContent ?? (
    <>
      The instantly available cap has <br /> a renewal time of {secondsToHours(props.renewalPeriod)} hours.
    </>
  )

  return (
    <Tooltip open={forceOpen}>
      <TooltipTrigger data-testid={testIds.marketDetails.capAutomator.cooldownTimer}>
        <TimerResetIcon size={16} className="text-fg-brand-tertiary" />
      </TooltipTrigger>
      <TooltipContent className="p-3">
        <div className="typography-label-4 flex flex-col gap-2 text-tertiary">
          Cooldown period:
          <div className="typography-label-2 text-primary-inverse">{secondsToTime(timeLeft)}</div>
          {timeLeft === 0 ? cooldownOverContent : cooldownActiveContent}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function secondsToHours(seconds: number) {
  return Math.floor(seconds / 3600)
}

function secondsToTime(seconds: number) {
  const hours = secondsToHours(seconds)
  const minutes = Math.floor((seconds % 3600) / 60)
  const sec = seconds % 60

  function formatTime(num: number) {
    return num.toString().padStart(2, '0')
  }

  return `${hours}h ${formatTime(minutes)}m ${formatTime(sec)}s`
}
