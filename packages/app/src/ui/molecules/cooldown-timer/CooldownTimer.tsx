import { assets } from '@/ui/assets'
import { IconPill } from '@/ui/atoms/icon-pill/IconPill'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useTimestamp } from '@/utils/useTimestamp'

interface CooldownTimerProps {
  renewalPeriod: number
  latestUpdateTimestamp: number
  /**
   * @warning This prop is only for storybook purposes.
   */
  forceOpen?: boolean
}

export function CooldownTimer({ renewalPeriod, latestUpdateTimestamp, forceOpen }: CooldownTimerProps) {
  const { timestamp } = useTimestamp({
    refreshIntervalInMs: 1000,
  })

  const timeLeft = Math.max(0, renewalPeriod - (timestamp - latestUpdateTimestamp))

  return (
    <Tooltip open={forceOpen}>
      <TooltipTrigger data-testid={testIds.marketDetails.capAutomator.cooldownTimer}>
        <IconPill icon={assets.timer} />
      </TooltipTrigger>
      <TooltipContentShort className="p-3">
        <div className="max-w-56">
          <Typography className={cn('text-white/70 text-xs')}>Cooldown period:</Typography>
          <Typography className={cn('mt-1 mb-2 font-semibold')}>{secondsToTime(timeLeft)}</Typography>
          <Typography className={cn('text-white/70 text-xs')}>
            {timeLeft === 0
              ? 'The cap renewal cooldown is over. It might be changed at any time.'
              : `The instantly available cap has a renewal time of ${secondsToHours(renewalPeriod)} hours.`}
          </Typography>
        </div>
      </TooltipContentShort>
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
