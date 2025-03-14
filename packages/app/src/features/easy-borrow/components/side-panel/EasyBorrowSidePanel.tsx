import { formatPercentage } from '@/domain/common/format'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { Panel } from '@/ui/atoms/panel/Panel'
import { HealthFactorPanelContent } from '@/ui/molecules/health-factor-panel-content/HealthFactorPanelContent'
import { testIds } from '@/ui/utils/testIds'
import BigNumber from 'bignumber.js'
import { BorrowDetails } from '../../logic/useEasyBorrow'

export interface EasyBorrowSidePanelProps extends BorrowDetails {
  hf?: BigNumber
  liquidationDetails?: LiquidationDetails
}

export function EasyBorrowSidePanel({ hf, liquidationDetails, borrowRate }: EasyBorrowSidePanelProps) {
  return (
    <Panel variant="secondary" spacing="none" className="grid h-fit grid-cols-1 sm:grid-cols-[3fr_2fr] xl:grid-cols-1">
      {hf && (
        <div className="p-4 md:p-6">
          <HealthFactorPanelContent hf={hf} liquidationDetails={liquidationDetails} />
        </div>
      )}
      <Panel variant="quaternary" spacing="m" className="flex flex-col justify-end gap-3 only:col-span-2">
        <h4 className="typography-heading-5">Borrow Rate</h4>
        <div className="flex flex-col gap-3">
          <h3
            className="typography-display-3 bg-gradient-borrow-rate-orange bg-clip-text text-transparent"
            data-testid={testIds.easyBorrow.form.borrowRate}
          >
            {formatPercentage(borrowRate, { skipSign: true })}%
          </h3>
          <div className="typography-body-3">Borrow assets directly from SKY</div>
        </div>
      </Panel>
    </Panel>
  )
}
