import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Button, LinkButton } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

export interface UpgradeSavingsBannerProps {
  onUpgradeSavingsClick: () => void
  dsr: Percentage
  ssr: Percentage
}

export function UpgradeSavingsBanner({ onUpgradeSavingsClick, dsr, ssr }: UpgradeSavingsBannerProps) {
  // @todo: figure out negative APY differences
  const savingsRateDifference = Percentage(ssr.minus(dsr).absoluteValue())

  return (
    <Panel.Wrapper
      className={cn(
        'relative isolate flex min-h-[240px] w-full flex-col justify-between overflow-hidden',
        'gap-6 px-6 py-6 md:gap-0 md:px-8',
        'bg-[#40E3A61A]/10 bg-right bg-no-repeat',
      )}
      style={{ backgroundImage: 'url(/backgrounds/susds-banner.svg)' }}
      data-testid={testIds.savings.upgradeSDaiBanner}
    >
      <div className="grid gap-3 md:auto-cols-max">
        <h2 className="font-semibold text-base text-basics-black sm:text-xl">
          Upgrade you Savings DAI (sDAI) to Savings USDS (sUSDS)
        </h2>
        <div>
          <div className="grid grid-cols-subgrid text-basics-black text-sm opacity-50">
            Upgrade your Savings DAI to Savings USDS and unlock <br /> the full potential of the Sky ecosystem.
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-2">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          {savingsRateDifference.gt(0) && (
            <Benefit>
              <span className="text-product-green">{formatPercentage(savingsRateDifference)} higher APY</span> compared
              to Savings DAI
            </Benefit>
          )}
          <Benefit>
            Upgrade at any size with <span className="text-product-green">no slippage</span>
          </Benefit>
          <Benefit>The upgrade is optional, and you can continue using Savings DAI</Benefit>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <Button onClick={onUpgradeSavingsClick}>Upgrade now</Button>
          <LinkButton variant="secondary" to="https://google.com" external>
            Learn more
          </LinkButton>
        </div>
      </div>
    </Panel.Wrapper>
  )
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <img src={assets.success} alt="success-img" className="h-4 w-4 translate-y-1" />
      <div>{children}</div>
    </div>
  )
}
