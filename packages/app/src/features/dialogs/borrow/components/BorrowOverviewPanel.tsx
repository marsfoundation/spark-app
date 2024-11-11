import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import BigNumber from 'bignumber.js'

export interface BorrowOverviewPanelProps {
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}
export function BorrowOverviewPanel({ currentHealthFactor, updatedHealthFactor }: BorrowOverviewPanelProps) {
  if (currentHealthFactor === undefined && updatedHealthFactor === undefined) {
    return null
  }

  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Health factor</TransactionOverview.Label>
        <TransactionOverview.HealthFactorChange
          currentHealthFactor={currentHealthFactor}
          updatedHealthFactor={updatedHealthFactor}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
