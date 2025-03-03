import { paths } from '@/config/paths'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'
import { SparkRewardsSummary } from '../../types'

export const TopbarSparkRewards = forwardRef<HTMLAnchorElement | HTMLButtonElement, SparkRewardsSummary>(
  ({ totalUsdAmount }, ref) => {
    return (
      <NavLink to={paths.sparkRewards} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
        <div
          className={cn(
            'relative isolate flex w-fit items-center gap-2 rounded-sm border p-2',
            'before:absolute before:inset-[-1px] before:z-[-2] before:rounded-[9px] before:bg-gradient-spark-secondary',
            'after:absolute after:inset-0 after:z-[-1] after:rounded-sm after:bg-primary',
            'focus-visible:after:hidden focus-visible:before:hidden',
          )}
        >
          <img src={assets.giftGradient} className="size-6" />
          {totalUsdAmount && (
            <span className="typography-button-1 text-primary">{USD_MOCK_TOKEN.formatUSD(totalUsdAmount)}</span>
          )}
        </div>
      </NavLink>
    )
  },
)
