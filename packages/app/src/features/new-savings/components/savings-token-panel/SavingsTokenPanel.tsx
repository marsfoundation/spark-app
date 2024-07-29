import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { SavingsWithdrawDialog } from '@/features/dialogs/savings/withdraw/SavingsWithdrawDialog'
import { SavingsInfoTile } from '@/features/savings/components/savings-info-tile/SavingsInfoTile'
import { APYLabel } from '@/features/savings/components/savings-opportunity/components/APYLabel'
import { Projections } from '@/features/savings/types'
import { getTokenImage } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { testIds } from '@/ui/utils/testIds'
import BigNumber from 'bignumber.js'

export interface SavingsTokenPanelProps {
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
  savingsBaseToken: Token
  savingsTokenWithBalance: TokenWithBalance
  APY: Percentage
  chainId: SupportedChainId
  projections: Projections
  openDialog: OpenDialogFunction
}

export function SavingsTokenPanel({
  depositedUSD,
  depositedUSDPrecision,
  savingsBaseToken,
  savingsTokenWithBalance,
  APY,
  chainId,
  projections,
  openDialog,
}: SavingsTokenPanelProps) {
  const compactProjections = projections.thirtyDays.gt(1_000)

  return (
    <Panel.Wrapper className="flex min-h-[260px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <h2 className="whitespace-nowrap font-semibold text-base text-basics-black sm:text-xl">
            {savingsTokenWithBalance.token.name}
          </h2>
        </div>
        <div className="flex flex-row gap-2">
          {import.meta.env.VITE_DEV_SEND_FROM_SAVINGS === '1' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openDialog(SavingsWithdrawDialog, { mode: 'send' } as const)}
            >
              Send
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openDialog(SavingsWithdrawDialog, { mode: 'withdraw' } as const)}
          >
            Withdraw
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        <div className="flex flex-row items-center gap-1.5 md:gap-3">
          <img src={getTokenImage(savingsBaseToken.symbol)} className="h-5 md:h-8" />
          <div
            className="flex flex-row items-end justify-center slashed-zero tabular-nums"
            data-testid={testIds.savings.sDaiBalanceInDai}
          >
            <div className="font-semibold text-3xl md:text-5xl">{getWholePart(depositedUSD)}</div>
            {depositedUSDPrecision > 0 && (
              <div className="font-semibold text-lg md:text-2xl">
                {getFractionalPart(depositedUSD, depositedUSDPrecision)}
              </div>
            )}
          </div>
        </div>
        <div className="font-semibold text-basics-dark-grey text-xs tracking-wide">
          =
          <span data-testid={testIds.savings.sDaiBalance}>
            {savingsTokenWithBalance.token.format(savingsTokenWithBalance.balance, { style: 'auto' })}{' '}
            {savingsTokenWithBalance.token.symbol}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-end justify-between border-t pt-6">
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is how much you'll earn in 30 days">
            <div className="hidden md:block">30-day projection</div>
            <div className="md:hidden"> 30-day </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value color="green">
            +
            {savingsBaseToken.formatUSD(projections.thirtyDays, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {savingsBaseToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is how much you'll earn in 1 year">
            <div className="hidden md:block"> 1-year projection </div>
            <div className="md:hidden"> 1-year </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value color="green">
            +
            {savingsBaseToken.formatUSD(projections.oneYear, {
              showCents: 'when-not-round',
              compact: compactProjections,
            })}{' '}
            {savingsBaseToken.symbol}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <APYLabel chainId={chainId} />
          <SavingsInfoTile.Value color="green">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
      </div>
    </Panel.Wrapper>
  )
}

function getWholePart(value: BigNumber): string {
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
  return formatter.format(value.integerValue(BigNumber.ROUND_DOWN).toNumber())
}

function getFractionalPart(value: BigNumber, precision: number): string {
  precision = Math.max(precision, 2)
  return value.minus(value.integerValue(BigNumber.ROUND_DOWN)).toFixed(precision).slice(1)
}
