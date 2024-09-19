import { EModeCategoryName } from '@/domain/e-mode/types'
import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { TransactionOverviewDetailsItem } from '../../common/components/transaction-overview/TransactionOverviewDetailsItem'

export interface AvailableAssets {
  categoryName: EModeCategoryName
  tokens: Token[]
}
export function AvailableAssets({ categoryName, tokens }: AvailableAssets) {
  if (categoryName === 'No E-Mode') {
    return (
      <TransactionOverviewDetailsItem label="Available assets">
        <div data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.assets}>All assets</div>
      </TransactionOverviewDetailsItem>
    )
  }

  return (
    <TransactionOverviewDetailsItem label="Available assets">
      <div className="flex items-center gap-2">
        <div
          className="hidden items-center gap-2 sm:flex"
          data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.category}
        >
          {categoryName}
          <img src={assets.arrowRight} />
        </div>
        <div data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.assets}>
          {tokens.map((token) => token.symbol).join(', ')}
        </div>
      </div>
    </TransactionOverviewDetailsItem>
  )
}
