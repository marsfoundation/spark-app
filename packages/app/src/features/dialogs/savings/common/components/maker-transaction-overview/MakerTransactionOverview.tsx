import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { assets } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { SavingsDialogTxOverviewMaker } from '../../types'
import { APYDetails, MakerBadge, RouteItem, TransactionOutcome, TransactionOverviewDetailsItem } from './components'

export interface MakerTransactionOverviewProps {
  txOverview: SavingsDialogTxOverviewMaker
  selectedToken: Token
}

export function MakerTransactionOverview({ txOverview, selectedToken }: MakerTransactionOverviewProps) {
  if (txOverview.status !== 'success') {
    return (
      <MakerTransactionOverviewPlaceholder isLoading={txOverview.status === 'loading'} badgeToken={selectedToken} />
    )
  }
  const { APY, daiEarnRate, route, makerBadgeToken } = txOverview

  assert(route.length > 0, 'Route must have at least one item')
  const outcome = route.at(-1)!

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="APY">
        <APYDetails APY={APY} daiEarnRate={daiEarnRate} />
      </TransactionOverviewDetailsItem>
      <TransactionOverviewDetailsItem label="Route">
        <div className="flex flex-col items-end gap-2 md:flex-row">
          {route.map((item, index) => (
            <RouteItem key={item.token.symbol} item={item} index={index} isLast={index === route.length - 1} />
          ))}
        </div>
        <MakerBadge
          token={makerBadgeToken}
          data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.makerBadge}
        />
      </TransactionOverviewDetailsItem>
      <TransactionOverviewDetailsItem label="Outcome">
        <TransactionOutcome
          outcome={outcome}
          data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.outcome}
        />
      </TransactionOverviewDetailsItem>
    </DialogPanel>
  )
}

interface MakerTransactionOverviewPlaceholder {
  isLoading: boolean
  badgeToken: Token
}
function MakerTransactionOverviewPlaceholder({ isLoading, badgeToken }: MakerTransactionOverviewPlaceholder) {
  const placeholder = isLoading ? (
    <img src={assets.threeDots} alt="loader" width={20} height={5} data-chromatic="ignore" />
  ) : (
    '-'
  )
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="APY">
        <div className="min-h-[46px]">{placeholder}</div>
      </TransactionOverviewDetailsItem>
      <TransactionOverviewDetailsItem label="Route">
        <div className="flex min-h-[92px] flex-col items-end justify-between">
          <div>{placeholder}</div>
          <MakerBadge token={badgeToken} />
        </div>
      </TransactionOverviewDetailsItem>
      <TransactionOverviewDetailsItem label="Outcome">{placeholder}</TransactionOverviewDetailsItem>
    </DialogPanel>
  )
}
