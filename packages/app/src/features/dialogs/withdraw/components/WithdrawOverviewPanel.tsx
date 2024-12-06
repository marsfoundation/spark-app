import { formatPercentage } from '@/domain/common/format'
import { TokenWithValue } from '@/domain/common/types'
import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'
import { PositionOverview } from '../logic/types'

export interface WithdrawOverviewPanelProps {
  withdrawAsset: TokenWithValue
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function WithdrawOverviewPanel({
  withdrawAsset,
  currentPositionOverview,
  updatedPositionOverview,
}: WithdrawOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Supply APY</TransactionOverview.Label>
        <TransactionOverview.Generic>{formatPercentage(currentPositionOverview.supplyAPY)}</TransactionOverview.Generic>
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Supply</TransactionOverview.Label>
        <TransactionOverview.TokenAmountChange
          token={withdrawAsset.token}
          currentAmount={currentPositionOverview.tokenSupply}
          updatedAmount={updatedPositionOverview?.tokenSupply}
        />
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
