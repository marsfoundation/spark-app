import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import { EModeCategory, PositionOverview } from '../types'

export interface EModeOverviewPanelProps {
  eModeCategory: EModeCategory
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function EModeOverviewPanel({
  eModeCategory,
  currentPositionOverview,
  updatedPositionOverview,
}: EModeOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Available assets</TransactionOverview.Label>
        <TransactionOverview.AvailableAssets categoryName={eModeCategory.name} tokens={eModeCategory.tokens} />
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Health factor</TransactionOverview.Label>
        <TransactionOverview.HealthFactorChange
          currentHealthFactor={currentPositionOverview.healthFactor}
          updatedHealthFactor={updatedPositionOverview?.healthFactor}
        />
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Maximum LTV</TransactionOverview.Label>
        <TransactionOverview.MaxLtvChange
          currentMaxLTV={currentPositionOverview.maxLTV}
          updatedMaxLTV={updatedPositionOverview?.maxLTV}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
