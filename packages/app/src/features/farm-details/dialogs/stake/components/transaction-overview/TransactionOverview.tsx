import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { RouteItem } from '@/features/dialogs/common/components/transaction-overview/RouteItem'
import { SkyBadge } from '@/features/dialogs/common/components/transaction-overview/SkyBadge'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { assert } from '@/utils/assert'
import { TxOverview } from '../../logic/createTxOverview'
import { FarmDestinationRouteItem } from './FarmDestinationRouteItem'
import { RewardsDetails } from './RewardsDetails'
import { TransactionOutcome } from './TransactionOutcome'
import { TransactionOverviewDetailsItem } from './TransactionOverviewDetailsItem'
import { TransactionOverviewPlaceholder } from './TransactionOverviewPlaceholder'

export interface TransactionOverviewProps {
  txOverview: TxOverview
  selectedToken: Token
}

export function TransactionOverview({ txOverview, selectedToken }: TransactionOverviewProps) {
  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder badgeToken={selectedToken} />
  }
  const { apy, rewardsToken, rewardsRate, routeToStakingToken } = txOverview

  assert(routeToStakingToken.length > 0, 'Route must have at least one item')
  const stakingTokenRouteItem = routeToStakingToken.at(-1)!
  const displayRouteVertically = Boolean(
    routeToStakingToken.length > 2 && routeToStakingToken[0]?.value?.gte(NormalizedUnitNumber(100_000)),
  )

  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        <TransactionOverviewDetailsItem label="Estimated Rewards">
          <RewardsDetails apy={apy} rewardsRate={rewardsRate} rewardsToken={rewardsToken} />
        </TransactionOverviewDetailsItem>
        <TransactionOverviewDetailsItem label="Route">
          <div className={cn('flex flex-col items-end gap-2', !displayRouteVertically && 'md:flex-row')}>
            {routeToStakingToken.map((item, index) => (
              <RouteItem
                key={item.token.symbol}
                item={item}
                index={index}
                isLast={false}
                displayRouteVertically={displayRouteVertically}
              />
            ))}
            <FarmDestinationRouteItem
              entryToken={selectedToken.symbol}
              rewardsToken={rewardsToken.symbol}
              displayRouteVertically={displayRouteVertically}
            />
          </div>
        </TransactionOverviewDetailsItem>
        <TransactionOverviewDetailsItem label="Outcome">
          <TransactionOutcome stakingTokenRouteItem={stakingTokenRouteItem} rewardsToken={rewardsToken.symbol} />
        </TransactionOverviewDetailsItem>
      </DialogPanel>

      <SkyBadge token={selectedToken} data-testid={testIds.dialog.transactionOverview.skyBadge} />
    </div>
  )
}
