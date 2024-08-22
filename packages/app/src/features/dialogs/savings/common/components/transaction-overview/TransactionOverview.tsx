import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { SavingsDialogTxOverview } from '../../types'
import { APYDetails, MakerBadge, RouteItem, TransactionOutcome, TransactionOverviewDetailsItem } from './components'

export interface TransactionOverviewProps {
  txOverview: SavingsDialogTxOverview
  selectedToken: Token
  showAPY?: boolean
}

export function TransactionOverview({ txOverview, selectedToken, showAPY }: TransactionOverviewProps) {
  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder badgeToken={selectedToken} showAPY={showAPY} />
  }
  const { APY, baseStable, stableEarnRate, route, makerBadgeToken } = txOverview

  assert(route.length > 0, 'Route must have at least one item')
  const outcome = route.at(-1)!
  const displayRouteVertically = Boolean(route.length > 2 && route[0]?.value?.gte(NormalizedUnitNumber(1_000_000)))

  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        {showAPY && (
          <TransactionOverviewDetailsItem label="APY">
            <APYDetails APY={APY} baseStable={baseStable} stableEarnRate={stableEarnRate} />
          </TransactionOverviewDetailsItem>
        )}
        <TransactionOverviewDetailsItem label="Route">
          <div className={cn('flex flex-col items-end gap-2', !displayRouteVertically && 'md:flex-row')}>
            {route.map((item, index) => (
              <RouteItem
                key={item.token.symbol}
                item={item}
                index={index}
                isLast={index === route.length - 1}
                displayRouteVertically={displayRouteVertically}
              />
            ))}
          </div>
        </TransactionOverviewDetailsItem>
        <TransactionOverviewDetailsItem label="Outcome">
          <TransactionOutcome
            outcome={outcome}
            data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.outcome}
          />
        </TransactionOverviewDetailsItem>
      </DialogPanel>

      <MakerBadge
        token={makerBadgeToken}
        data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.makerBadge}
      />
    </div>
  )
}

interface TransactionOverviewPlaceholder {
  badgeToken: Token
  showAPY?: boolean
}
function TransactionOverviewPlaceholder({ badgeToken, showAPY }: TransactionOverviewPlaceholder) {
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
      <MakerBadge token={badgeToken} />
    </div>
  )
}
