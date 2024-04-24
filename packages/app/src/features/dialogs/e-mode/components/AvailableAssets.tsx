import { EModeCategoryName } from '@/domain/e-mode/types'
import { Token } from '@/domain/types/Token'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'
import { assets } from '@/ui/assets'

export interface AvailableAssets {
  categoryName: EModeCategoryName
  tokens: Token[]
}
export function AvailableAssets({ categoryName, tokens }: AvailableAssets) {
  if (categoryName === 'No E-Mode') {
    return <TransactionOverviewDetailsItem label="Available assets">All assets</TransactionOverviewDetailsItem>
  }

  return (
    <TransactionOverviewDetailsItem label="Available assets">
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 sm:flex">
          {categoryName}
          <img src={assets.arrowRight} />
        </div>
        {tokens.map((token) => token.symbol).join(', ')}
      </div>
    </TransactionOverviewDetailsItem>
  )
}
