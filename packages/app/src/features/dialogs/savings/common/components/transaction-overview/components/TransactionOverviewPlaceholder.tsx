import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { SkyBadge } from '@/features/dialogs/common/components/transaction-overview/SkyBadge'
import { TransactionOverviewDetailsItem } from './TransactionOverviewDetailsItem'

export interface TransactionOverviewPlaceholder {
  badgeToken: Token
  showAPY?: boolean
}
export function TransactionOverviewPlaceholder({ badgeToken, showAPY }: TransactionOverviewPlaceholder) {
  const placeholder = '-'
  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        {showAPY && (
          <TransactionOverviewDetailsItem label="APY">
            <div className="min-h-[46px]">{placeholder}</div>
          </TransactionOverviewDetailsItem>
        )}
        <TransactionOverviewDetailsItem label="Route">
          <div className="flex min-h-[46px] flex-col items-end justify-between">
            <div>{placeholder}</div>
          </div>
        </TransactionOverviewDetailsItem>
        <TransactionOverviewDetailsItem label="Outcome">{placeholder}</TransactionOverviewDetailsItem>
      </DialogPanel>
      <SkyBadge token={badgeToken} />
    </div>
  )
}
