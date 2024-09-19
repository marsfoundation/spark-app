import { formatPercentage } from '@/domain/common/format'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { HealthFactorChange } from '../../common/components/transaction-overview/HealthFactorChange'
import { TransactionOverviewDetailsItem } from '../../common/components/transaction-overview/TransactionOverviewDetailsItem'
import { collateralTypeToDescription } from '../logic/collateralization'
import { PositionOverview } from '../logic/types'

export interface DepositOverviewPanelProps {
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function DepositOverviewPanel({ currentPositionOverview, updatedPositionOverview }: DepositOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="Supply APY">
        {formatPercentage(currentPositionOverview.supplyAPY)}
      </TransactionOverviewDetailsItem>
      <TransactionOverviewDetailsItem label="Collateralization">
        {collateralTypeToDescription(currentPositionOverview.collateralization)}
      </TransactionOverviewDetailsItem>
      <HealthFactorChange
        currentHealthFactor={currentPositionOverview.healthFactor}
        updatedHealthFactor={updatedPositionOverview?.healthFactor}
      />
    </DialogPanel>
  )
}
