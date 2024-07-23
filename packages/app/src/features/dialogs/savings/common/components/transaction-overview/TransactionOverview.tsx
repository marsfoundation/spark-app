import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { SavingsDialogTxOverview } from '../../types'
import { APYDetails, MakerBadge, RouteItem, TransactionOutcome, TransactionOverviewDetailsItem } from './components'

export interface TransactionOverviewProps {
  txOverview: SavingsDialogTxOverview
  selectedToken: Token
}

export function TransactionOverview({ txOverview, selectedToken }: TransactionOverviewProps) {
  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder isLoading={txOverview.status === 'loading'} badgeToken={selectedToken} />
  }
  const { APY, dai, daiEarnRate, route, makerBadgeToken } = txOverview

  assert(route.length > 0, 'Route must have at least one item')
  const outcome = route.at(-1)!
  const displayRouteVertically = Boolean(route.length > 2 && route[0]?.value?.gte(NormalizedUnitNumber(1_000_000)))

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="APY">
        <APYDetails APY={APY} dai={dai} daiEarnRate={daiEarnRate} />
      </TransactionOverviewDetailsItem>
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

interface TransactionOverviewPlaceholder {
  isLoading: boolean
  badgeToken: Token
}
function TransactionOverviewPlaceholder({ isLoading, badgeToken }: TransactionOverviewPlaceholder) {
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
