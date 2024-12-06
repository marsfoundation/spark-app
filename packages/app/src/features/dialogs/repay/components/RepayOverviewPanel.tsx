import { Token } from '@/domain/types/Token'
import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'
import { PositionOverview } from '../logic/types'

export interface RepayOverviewPanelProps {
  debtAsset: Token
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function RepayOverviewPanel({
  debtAsset,
  currentPositionOverview,
  updatedPositionOverview,
}: RepayOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Debt</TransactionOverview.Label>
        <TransactionOverview.TokenAmountChange
          token={debtAsset}
          currentAmount={currentPositionOverview.debt}
          updatedAmount={updatedPositionOverview?.debt}
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
