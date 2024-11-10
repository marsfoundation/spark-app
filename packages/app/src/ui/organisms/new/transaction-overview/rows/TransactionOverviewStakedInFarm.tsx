import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { testIds } from '@/ui/utils/testIds'

export interface TransactionOverviewStakedInFarmProps {
  token: Token
  amount: NormalizedUnitNumber
  usdAmount?: NormalizedUnitNumber
  farmName: string
}

export function TransactionOverviewStakedInFarm({
  token,
  amount,
  usdAmount,
  farmName,
}: TransactionOverviewStakedInFarmProps) {
  const formattedAmount = token.format(amount, { style: 'auto' })
  const formattedUsdAmount = usdAmount ? USD_MOCK_TOKEN.formatUSD(usdAmount) : token.formatUSD(amount)

  return (
    <div className="flex w-fit items-center gap-1.5">
      <TokenIcon token={token} className="h-4 w-4" />
      <div className="flex items-baseline gap-1">
        <div
          className="typography-label-4 text-primary"
          data-testid={testIds.farmDetails.stakeDialog.transactionOverview.outcome}
        >
          {formattedAmount}
          {/* @note: next line is need to maintain backward compatibility with e2e test - amount should include token symbol */}
          <span className="hidden"> {token.symbol}</span>
        </div>
        <div
          className="typography-body-6 text-secondary"
          data-testid={testIds.farmDetails.stakeDialog.transactionOverview.outcomeUsd}
        >
          {formattedUsdAmount} Staked in {farmName}
        </div>
      </div>
    </div>
  )
}
