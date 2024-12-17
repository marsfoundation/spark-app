import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Token } from '@/domain/types/Token'
import { savingsWithdrawDialogConfig } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { Percentage } from '@marsfoundation/common-universal'
import { SavingsMetaItem } from '../../logic/makeSavingsMeta'
import { SavingsOverview } from '../../logic/makeSavingsOverview'
import { Projections } from '../../types'
import { GrowingBalance } from '../growing-balance/GrowingBalance'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { SavingsRateTooltipContent } from '../savings-rate-tooltip-content/SavingsRateTooltipContent'

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
        'flex flex-col justify-between gap-8 bg-right bg-no-repeat md:bg-contain',
        savingsType === 'sdai' ? 'bg-sdai-token-panel' : 'bg-susds-token-panel',
      )}
      data-testid={testIds.savings[savingsType].panel}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <div className="typography-heading-4 text-primary-inverse">
            {savingsType === 'sdai' ? 'DAI Savings' : 'USDS Savings'}
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
      <div className="flex divide-x divide-fg-secondary">
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
        <SavingsInfoTile>
          <SavingsInfoTile.Label
            tooltipContent={
              <SavingsRateTooltipContent originChainId={originChainId} savingsMetaItem={savingsMetaItem} />
            }
          >
            {savingsMetaItem.rateAcronym} Rate
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value className="text-primary-inverse">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
      </div>
    </Panel>
  )
}
