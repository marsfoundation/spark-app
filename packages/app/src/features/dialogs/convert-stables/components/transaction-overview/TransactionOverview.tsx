import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { RouteItem } from '@/features/dialogs/common/components/transaction-overview/RouteItem'
import { SkyBadge } from '@/features/dialogs/common/components/transaction-overview/SkyBadge'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/transaction-overview/TransactionOverviewDetailsItem'
import { testIds } from '@/ui/utils/testIds'
import { TransactionOutcome } from '../../../common/components/transaction-overview/TransactionOutcome'
import { TransactionOverviewPlaceholder } from '../../../common/components/transaction-overview/TransactionOverviewPlaceholder'
import { TxOverview } from '../../logic/createTxOverview'

export interface TransactionOverviewProps {
  from: Token
  to: Token
  txOverview: TxOverview
}

export function TransactionOverview({ from, to, txOverview }: TransactionOverviewProps) {
  const badgeTokens = [from.symbol, to.symbol]

  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder badgeTokens={badgeTokens} />
  }

  const { route, outcome } = txOverview

  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        <TransactionOverviewDetailsItem label="Route">
          <div className="flex flex-col items-end gap-2 md:flex-row">
            {route.map((item, index) => (
              <RouteItem
                key={item.token.symbol}
                item={item}
                index={index}
                isLast={index === route.length - 1}
                displayRouteVertically={false}
              />
            ))}
          </div>
        </TransactionOverviewDetailsItem>
        <TransactionOverviewDetailsItem label="Outcome">
          <TransactionOutcome outcome={outcome} />
        </TransactionOverviewDetailsItem>
      </DialogPanel>

      <SkyBadge tokens={badgeTokens} data-testid={testIds.dialog.transactionOverview.skyBadge} />
    </div>
  )
}
