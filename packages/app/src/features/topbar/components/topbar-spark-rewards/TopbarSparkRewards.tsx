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
            'relative isolate flex h-full w-fit items-center gap-2 rounded-sm p-2',
            'border border-primary bg-white shadow-xs',
          )}
        >
          <img src={assets.page.sparkRewards} className="size-5" />
          {totalUsdAmount && (
            <span className="typography-button-1 text-primary">{USD_MOCK_TOKEN.formatUSD(totalUsdAmount)}</span>
          )}
        </div>
      </NavLink>
    )
  },
)
