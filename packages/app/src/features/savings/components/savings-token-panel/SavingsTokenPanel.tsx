import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { Button } from '@/ui/atoms/new/button/Button'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { cn } from '@/ui/utils/style'
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
    <Panel
      spacing="m"
      className={cn(
        'flex flex-col justify-between gap-4 bg-right bg-no-repeat',
        savingsType === 'sdai' ? 'bg-savings-dai-token-panel' : 'bg-savings-usds-token-panel',
      )}
      data-testid={testIds.savings[savingsType].panel}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <div className="typography-heading-4 text-primary-inverse">
            {savingsType === 'sdai' ? 'Savings DAI' : 'Savings USDS'}
          </div>
        </div>
        <div className="md:-mt-2 md:-mr-2 flex flex-row gap-1">
          <Button
            variant="tertiary"
            size="m"
            onClick={() => openDialog(savingsWithdrawDialogConfig, { mode: 'send', savingsType } as const)}
          >
            Send
          </Button>
          <Button
            variant="tertiary"
            size="m"
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
      <div className="flex gap-2 lg:gap-6 md:gap-5 sm:gap-3">
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is an estimate of what you could earn in 30 days.">
            <div className="hidden lg:block">30-day projection</div>
            <div className="lg:hidden"> 30-day </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value className="text-primary-inverse">
            +
            {assetsToken.formatUSD(currentProjections.thirtyDays, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {assetsToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <div className="w-px border-reskin-fg-secondary border-r" />
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is an estimate of what you could earn in one year.">
            <div className="hidden lg:block"> 1-year projection </div>
            <div className="lg:hidden"> 1-year </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value className="text-primary-inverse">
            +
            {assetsToken.formatUSD(currentProjections.oneYear, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {assetsToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <div className="w-px border-reskin-fg-secondary border-r" />
        <SavingsInfoTile>
          <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMetaItem} />
          <SavingsInfoTile.Value className="text-primary-inverse">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
      </div>
    </Panel>
  )
}
