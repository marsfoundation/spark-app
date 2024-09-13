import { formatPercentage } from '@/domain/common/format'
import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'
import { assets } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { RouteItem, SkyBadge, TransactionOutcome } from '../../../common/components/transaction-overview/components'
import { TransactionOverviewPlaceholder } from '../../../common/components/transaction-overview/components/TransactionOverviewPlaceholder'
import { MigrateDialogTxOverview } from '../types'

export interface TransactionOverviewProps {
  txOverview: MigrateDialogTxOverview
  selectedToken: Token
  showAPY?: boolean
}

export function TransactionOverview({ txOverview, selectedToken, showAPY }: TransactionOverviewProps) {
  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder badgeToken={selectedToken} showAPY={showAPY} />
  }
  const { apyChange, route } = txOverview

  assert(route.length > 0, 'Route must have at least one item')
  const outcome = route.at(-1)!
  const inputToken = route[0]!.token

  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        {apyChange && (
          <TransactionOverviewDetailsItem label="APY">
            <div className="flex flex-row items-center gap-2">
              <div data-testid={testIds.dialog.savings.transactionOverview.apyChange.before}>
                {formatPercentage(apyChange.current)}
              </div>
              <img src={assets.arrowRight} />
              <div data-testid={testIds.dialog.savings.transactionOverview.apyChange.after}>
                {formatPercentage(apyChange.updated)}
              </div>
            </div>
          </TransactionOverviewDetailsItem>
        )}
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
          <TransactionOutcome outcome={outcome} data-testid={testIds.dialog.savings.transactionOverview.outcome} />
        </TransactionOverviewDetailsItem>
      </DialogPanel>

      <SkyBadge token={inputToken} data-testid={testIds.dialog.savings.transactionOverview.skyBadge} />
    </div>
  )
}
