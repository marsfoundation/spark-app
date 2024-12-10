import { EModeCategoryName } from '@/domain/e-mode/types'
import { Token } from '@/domain/types/Token'
import { testIds } from '@/ui/utils/testIds'
import { MoveRightIcon } from 'lucide-react'

export interface TransactionOverviewAvailableAssetsProps {
  categoryName: EModeCategoryName
  tokens: Token[]
}
export function TransactionOverviewAvailableAssets({ categoryName, tokens }: TransactionOverviewAvailableAssetsProps) {
  if (categoryName === 'No E-Mode') {
    return (
      <div
        className="typography-label-2 text-primary"
        data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.assets}
      >
        All assets
      </div>
    )
  }

  return (
    <div className="typography-label-2 flex items-center gap-2.5 text-primary">
      <div data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.category}>{categoryName}</div>
      <MoveRightIcon className="icon-xxs icon-secondary" />
      <div data-testid={testIds.dialog.eMode.transactionOverview.availableAssets.assets}>
        {tokens.map((token) => token.symbol).join(', ')}
      </div>
    </div>
  )
}
