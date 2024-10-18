import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { getFractionalPart, getWholePart } from '@/utils/bigNumber'
import { useTimestamp } from '@/utils/useTimestamp'
import { SavingsOverview } from '../../logic/makeSavingsOverview'

export interface GrowingBalanceProps {
  savingsTokenWithBalance: TokenWithBalance
  assetsToken: Token
  calculateSavingsBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
  savingsType: 'sdai' | 'susds'
}

export function GrowingBalance({
  savingsTokenWithBalance,
  assetsToken,
  calculateSavingsBalance,
  balanceRefreshIntervalInMs,
  savingsType,
}: GrowingBalanceProps) {
  const { timestampInMs } = useTimestamp({ refreshIntervalInMs: balanceRefreshIntervalInMs })
  const { depositedAssets, depositedAssetsPrecision } = calculateSavingsBalance(timestampInMs)

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="flex flex-row items-center gap-1.5 md:gap-3">
        <img src={getTokenImage(assetsToken.symbol)} className="h-5 md:h-8" />
        <div
          className="flex flex-row items-end justify-center slashed-zero tabular-nums"
          data-testid={testIds.savings[savingsType].balanceInAsset}
        >
          <div className="font-semibold text-3xl md:text-5xl">{getWholePart(depositedAssets)}</div>
          {depositedAssetsPrecision > 0 && (
            <div className="font-semibold text-lg md:text-2xl">
              {getFractionalPart(depositedAssets, depositedAssetsPrecision)}
            </div>
          )}
        </div>
      </div>
      <div className="font-semibold text-basics-dark-grey text-xs tracking-wide">
        =
        <span data-testid={testIds.savings[savingsType].balance}>
          {savingsTokenWithBalance.token.format(savingsTokenWithBalance.balance, { style: 'auto' })}{' '}
          {savingsTokenWithBalance.token.symbol}
        </span>
      </div>
    </div>
  )
}
