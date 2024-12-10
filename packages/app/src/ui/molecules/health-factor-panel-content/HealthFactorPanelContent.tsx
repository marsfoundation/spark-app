import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { HealthFactorGauge } from '@/ui/atoms/health-factor-gauge/HealthFactorGauge'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { cn } from '@/ui/utils/style'
import BigNumber from 'bignumber.js'
import { forwardRef } from 'react'
import { Info } from '../info/Info'

export interface HealthFactorPanelContentProps {
  hf?: BigNumber
  className?: string
  liquidationDetails?: LiquidationDetails
}

export const HealthFactorPanelContent = forwardRef<HTMLDivElement, HealthFactorPanelContentProps>(
  ({ hf, liquidationDetails, className }, ref) => {
    return (
      <div className={cn('flex h-full flex-col gap-8', className)} ref={ref}>
        <div className="flex items-center gap-2">
          <h3 className="typography-heading-5">Health factor</h3>
          <Info>
            <p>
              The health factor is a number that shows how safe your assets are in the protocol. It's calculated by
              comparing the value of what you've deposited to what you've borrowed.
            </p>
            <p>
              A higher health factor means your deposited assets are worth more (or you've borrowed less), lowering the
              chance of liquidating your assets.
            </p>
            <p>
              Keep in mind that these calculations follow the protocol's rules, which might change over time. For more
              information about Health Factor, you can visit{' '}
              <Link to={links.docs.healthFactor} external>
                docs
              </Link>
              .
            </p>
          </Info>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-8 p-8 pt-0 sm:p-0">
          <HealthFactorGauge value={hf} className="h-full w-full max-w-[400px]" />
          {liquidationDetails && (
            <div className="flex w-full flex-col">
              <div className="mb-3 flex items-center justify-between border-fg-primary border-b pb-3">
                <div className="flex flex-row items-center gap-2">
                  <div className="typography-label-2">Liquidation Price</div>
                  <Info>
                    Estimated price of {liquidationDetails.tokenWithPrice.symbol} at which the position may be
                    liquidated.
                  </Info>
                </div>
                <div>{USD_MOCK_TOKEN.formatUSD(liquidationDetails.liquidationPrice)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <div className="typography-label-2">Current {liquidationDetails.tokenWithPrice.symbol} Price </div>
                  <Info>Current price of {liquidationDetails.tokenWithPrice.symbol}.</Info>
                </div>
                <div>{USD_MOCK_TOKEN.formatUSD(liquidationDetails.tokenWithPrice.priceInUSD)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)
