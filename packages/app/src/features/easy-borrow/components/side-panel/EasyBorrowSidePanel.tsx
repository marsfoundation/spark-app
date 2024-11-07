import { formatPercentage } from '@/domain/common/format'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { HealthFactorPanelContent } from '@/ui/molecules/new/health-factor-panel-content/HealthFactorPanelContent'
import { testIds } from '@/ui/utils/testIds'
import BigNumber from 'bignumber.js'
import { BorrowDetails } from '../../logic/useEasyBorrow'

export interface EasyBorrowSidePanelProps extends BorrowDetails {
  hf?: BigNumber
  liquidationDetails?: LiquidationDetails
}

export function EasyBorrowSidePanel({ hf, liquidationDetails, borrowRate, dai, usds }: EasyBorrowSidePanelProps) {
  return (
    <Panel variant="secondary" spacing="none" className="h-fit">
      {hf && (
        <div className="p-2 md:p-6 sm:p-3">
          <HealthFactorPanelContent hf={hf} liquidationDetails={liquidationDetails} />
        </div>
      )}
      <Panel variant="quaternary" spacing="s" className="flex flex-col gap-3">
        <h4 className="typography-label-2">Borrow Rate</h4>
        <div className="flex flex-col gap-3">
          <h3
            className="typography-display-3 bg-gradient-borrow-rate-orange bg-clip-text text-transparent"
            data-testid={testIds.easyBorrow.form.borrowRate}
          >
            {formatPercentage(borrowRate, { skipSign: true })}%
          </h3>
          <div className="typography-body-5">
            Borrow {dai}
            {usds ? ` or ${usds}` : ''} directly from SKY
          </div>
        </div>
      </Panel>
    </Panel>
  )
}
