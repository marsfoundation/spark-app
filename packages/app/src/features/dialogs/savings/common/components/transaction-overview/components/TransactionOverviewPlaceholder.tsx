import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'

export interface TransactionOverviewPlaceholder {
  badgeToken: TokenSymbol
  showAPY?: boolean
}
export function TransactionOverviewPlaceholder({ showAPY }: TransactionOverviewPlaceholder) {
  const placeholder = '-'
  return (
    <TransactionOverview>
      {showAPY && (
        <TransactionOverview.Row>
          <TransactionOverview.Label>APY</TransactionOverview.Label>
          <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
        </TransactionOverview.Row>
      )}
      <TransactionOverview.Row>
        <TransactionOverview.Label>Route</TransactionOverview.Label>
        <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
