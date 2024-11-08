import BigNumber from 'bignumber.js'
import { forwardRef } from 'react'

import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { HealthFactorBadge } from '@/ui/atoms/health-factor-badge/HealthFactorBadge'
import { HealthFactorGauge } from '@/ui/atoms/health-factor-gauge/HealthFactorGauge'
// import { Link } from '@/ui/atoms/link/Link'
import { Panel } from '@/ui/atoms/panel/Panel'
// import { links } from '@/ui/constants/links'
import { Info } from '@/ui/molecules/info/Info'
import { cn } from '@/ui/utils/style'

import { LiquidationOverview } from './components/LiquidationOverview'

export interface HealthFactorPanelProps {
  hf?: BigNumber
  className?: string
  liquidationDetails?: LiquidationDetails
  variant: 'full-details' | 'with-liquidation-price'
}

export const HealthFactorPanel = forwardRef<HTMLDivElement, HealthFactorPanelProps>(
  ({ hf, liquidationDetails, variant, className }, ref) => {
    return (
      <Panel className={cn('w-full bg-panel-bg px-6 py-4', className)} ref={ref}>
        <Panel.Header className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center gap-1">
            <Panel.Title className="text-xl sm:text-2xl">Health Factor</Panel.Title>
            <Info>
              <p>
                The health factor is a number that shows how safe your assets are in the protocol. It's calculated by
                comparing the value of what you've deposited to what you've borrowed.
              </p>
              <p>
                A higher health factor means your deposited assets are worth more (or you've borrowed less), lowering
                the chance of liquidating your assets.
              </p>
              <p>
                Keep in mind that these calculations follow the protocol's rules, which might change over time.
                {/* For more
                information about Health Factor, you can visit{' '}
                <Link to={links.docs.healthFactor} external>
                  docs
                </Link>
                . */}
              </p>
            </Info>
          </div>

          <HealthFactorBadge hf={hf} />
        </Panel.Header>

        <Panel.Content className="flex h-full flex-col justify-center">
          <div className={cn('flex flex-col justify-center gap-4', variant === 'full-details' && 'sm:flex-row')}>
            <div
              className={cn(
                'flex flex-col justify-end px-4',
                variant === 'full-details' ? 'min-w-[60%]' : 'w-full items-center',
                liquidationDetails && variant === 'with-liquidation-price' && 'h-32',
              )}
            >
              <HealthFactorGauge value={hf} className="max-w-lg" />
            </div>
            <LiquidationOverview liquidationDetails={liquidationDetails} variant={variant} />
          </div>
        </Panel.Content>
      </Panel>
    )
  },
)
HealthFactorPanel.displayName = 'HealthFactorPanel'
