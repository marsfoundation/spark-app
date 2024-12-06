import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'

export interface TransactionOverviewPlaceholder {
  badgeToken: TokenSymbol
  showSkyBadge?: boolean
  showAPY?: boolean
}
export function TransactionOverviewPlaceholder({ showAPY, showSkyBadge }: TransactionOverviewPlaceholder) {
  const placeholder = '-'
  return (
    <TransactionOverview showSkyBadge={showSkyBadge}>
      {showAPY && (
        <TransactionOverview.Row>
          <TransactionOverview.Label>APY</TransactionOverview.Label>
          <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
        </TransactionOverview.Row>
      )}
      <TransactionOverview.Row>
        <TransactionOverview.Label>Route</TransactionOverview.Label>
        <TransactionOverview.RoutePlaceholder>{placeholder}</TransactionOverview.RoutePlaceholder>
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
