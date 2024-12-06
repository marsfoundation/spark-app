import { formatPercentage } from '@/domain/common/format'
import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'
import { collateralTypeToDescription } from '../logic/collateralization'
import { PositionOverview } from '../logic/types'

export interface DepositOverviewPanelProps {
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function DepositOverviewPanel({ currentPositionOverview, updatedPositionOverview }: DepositOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Supply APY</TransactionOverview.Label>
        <TransactionOverview.Generic>{formatPercentage(currentPositionOverview.supplyAPY)}</TransactionOverview.Generic>
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Collateralization</TransactionOverview.Label>
        <TransactionOverview.Generic>
          {collateralTypeToDescription(currentPositionOverview.collateralization)}
        </TransactionOverview.Generic>
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Health factor</TransactionOverview.Label>
        <TransactionOverview.HealthFactorChange
          currentHealthFactor={currentPositionOverview.healthFactor}
          updatedHealthFactor={updatedPositionOverview?.healthFactor}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
