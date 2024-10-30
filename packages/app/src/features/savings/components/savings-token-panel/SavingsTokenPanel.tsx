import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import { SavingsMetaItem } from '../../logic/makeSavingsMeta'
import { SavingsOverview } from '../../logic/makeSavingsOverview'
import { Projections } from '../../types'
import { GrowingBalance } from '../growing-balance/GrowingBalance'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from '../savings-opportunity/components/DSRLabel'

export interface SavingsTokenPanelProps {
  variant: 'dai' | 'usds'
  savingsTokenWithBalance: TokenWithBalance
  assetsToken: Token
  calculateSavingsBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
  APY: Percentage
  originChainId: SupportedChainId
  currentProjections: Projections
  openDialog: OpenDialogFunction
  savingsMetaItem: SavingsMetaItem
}

export function SavingsTokenPanel({
  variant,
  savingsTokenWithBalance,
  assetsToken,
  calculateSavingsBalance,
  balanceRefreshIntervalInMs,
  APY,
  originChainId,
  currentProjections,
  openDialog,
  savingsMetaItem,
}: SavingsTokenPanelProps) {
  const compactProjections = currentProjections.thirtyDays.gt(1_000)
  const savingsType = variant === 'dai' ? 'sdai' : 'susds'

  return (
    <Panel.Wrapper
      className="flex min-h-[260px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]"
      data-testid={testIds.savings[savingsType].panel}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <h2 className="whitespace-nowrap font-semibold text-base sm:text-xl">
            {savingsType === 'sdai' ? 'Savings DAI' : 'Savings USDS'}
          </h2>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openDialog(savingsWithdrawDialogConfig, { mode: 'send', savingsType } as const)}
          >
            Send
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openDialog(savingsWithdrawDialogConfig, { mode: 'withdraw', savingsType } as const)}
          >
            Withdraw
          </Button>
        </div>
      </div>
      <GrowingBalance
        savingsTokenWithBalance={savingsTokenWithBalance}
        assetsToken={assetsToken}
        calculateSavingsBalance={calculateSavingsBalance}
        balanceRefreshIntervalInMs={balanceRefreshIntervalInMs}
        savingsType={savingsType}
      />
      <div className="flex flex-row items-end justify-between border-t pt-6">
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is an estimate of what you could earn in 30 days.">
            <div className="hidden md:block">30-day projection</div>
            <div className="md:hidden"> 30-day </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value color="green">
            +
            {assetsToken.formatUSD(currentProjections.thirtyDays, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {assetsToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is an estimate of what you could earn in one year.">
            <div className="hidden md:block"> 1-year projection </div>
            <div className="md:hidden"> 1-year </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value color="green">
            +
            {assetsToken.formatUSD(currentProjections.oneYear, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {assetsToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMetaItem} />
          <SavingsInfoTile.Value color="green">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
      </div>
    </Panel.Wrapper>
  )
}
