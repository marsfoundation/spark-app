import { formatPercentage } from '@/domain/common/format'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { Panel } from '@/ui/atoms/panel/Panel'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { useBreakpoint } from '@/ui/utils/useBreakpoint'
import { Percentage } from '@marsfoundation/common-universal'
import { CheckIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface UpgradeSavingsBannerProps {
  onUpgradeSavingsClick: () => void
  apyImprovement?: Percentage
}

export function UpgradeSavingsBanner({ onUpgradeSavingsClick, apyImprovement }: UpgradeSavingsBannerProps) {
  const tablet = useBreakpoint('sm')
  return (
    <Panel
      spacing="none"
      className="flex items-center gap-4 overflow-hidden bg-[#E8F8EC] sm:gap-6"
      data-testid={testIds.savings.upgradeSDaiBanner}
    >
      <img src={assets.savings.upgradeBannerBg} alt="savings-upgrade-banner" className="-ml-6 w-32 sm:ml-0 sm:w-auto" />
      <div
        className={cn(
          'mx-auto grid grid-rows-[1fr_auto] items-center gap-x-6 gap-y-2 pr-4',
          'lg:grid-cols-[1fr_1fr_auto] md:grid-cols-[1fr_1fr] md:grid-rows-1 sm:gap-y-3 sm:pr-8',
        )}
      >
        <div className="typography-label-2 sm:typography-heading-5 justify-self-end text-primary">
          Upgrade your <span className="text-[#76C14A]">Savings DAI</span> to{' '}
          <span className="text-system-success-primary">Savings USDS</span>
          <span className="hidden sm:inline"> and unlock the full potential of the Sky ecosystem.</span>
        </div>
        <div className="hidden flex-col gap-2 lg:flex">
          {apyImprovement && (
            <Benefit>
              <span className="text-system-success-primary">{formatPercentage(apyImprovement)} higher APY</span>{' '}
              compared to sDAI
            </Benefit>
          )}
          <Benefit>Upgrade at any size with no slippage</Benefit>
          <Benefit>The upgrade is optional, and you can continue using Savings DAI</Benefit>
        </div>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-1 md:grid-rows-2">
          <Button variant="secondary" size={tablet ? 'm' : 's'} onClick={onUpgradeSavingsClick}>
            Upgrade now
          </Button>
          <LinkButton to={links.docs.upgradeSdai} external variant="tertiary" size={tablet ? 'm' : 's'}>
            Learn more
          </LinkButton>
        </div>
      </div>
    </Panel>
  )
}

function Benefit({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckIcon className="icon-xs icon-system-success-primary shrink-0" />
      <div className="typography-label-3">{children}</div>
    </div>
  )
}
