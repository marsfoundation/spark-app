import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { getTokenImage } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
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
    <div className="isolate grid grid-cols-[auto_1fr] items-center gap-x-2 lg:gap-x-4 lg:gap-y-2">
      <img src={getTokenImage(assetsToken.symbol)} className="h-8 shrink-0 lg:h-12 xl:h-14" />
      <div className="flex items-baseline tabular-nums" data-testid={testIds.savings[savingsType].balanceInAsset}>
        <div
          className={cn(
            'typography-heading-3 lg:typography-display-3 xl:typography-display-2 relative bg-clip-text text-transparent',
            savingsType === 'sdai' ? 'bg-gradient-savings-dai-counter' : 'bg-gradient-savings-usds-counter',
          )}
        >
          {getWholePart(depositedAssets)}
        </div>
        {depositedAssetsPrecision > 0 && (
          <div className="relative">
            <div
              className={cn(
                'typography-heading-4 [text-shadow:_0_1px_4px_rgb(0_0_0)]',
                savingsType === 'sdai' ? 'text-[#54AC3D]' : 'text-[#00C2A1]',
              )}
            >
              {getFractionalPart(depositedAssets, depositedAssetsPrecision)}
            </div>
          </div>
        )}
      </div>
      <div
        className="typography-label-4 col-start-2 ml-1.5 text-primary-inverse"
        data-testid={testIds.savings[savingsType].balance}
      >
        {savingsTokenWithBalance.token.format(savingsTokenWithBalance.balance, { style: 'auto' })}{' '}
        {savingsTokenWithBalance.token.symbol}
      </div>
    </div>
  )
}
