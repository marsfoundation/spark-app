import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/atoms/new/select/Select'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

interface AssetSelectorProps {
  assets: TokenWithBalance[]
  selectedAsset: Token
  setSelectedAsset: (newSymbol: TokenSymbol) => void
  showBalance?: boolean
  disabled?: boolean
}

export function AssetSelector({
  assets,
  selectedAsset,
  setSelectedAsset,
  showBalance = true,
  disabled = false,
}: AssetSelectorProps) {
  if ((assets.length === 1 && selectedAsset?.symbol === assets[0]!.token.symbol) || assets.length === 0) {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-between p-3',
          'rounded-sm border border-primary bg-primary text-reskin-fg-primary',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        data-testid={testIds.component.AssetSelector.trigger}
      >
        <div className="flex flex-row items-center gap-2" data-testid={testIds.component.AssetSelector.option}>
          <TokenIcon token={selectedAsset} className="h-6 w-6" />
          <div className="typography-label-4">{selectedAsset.symbol}</div>
        </div>
      </div>
    )
  }

  return (
    <Select value={selectedAsset?.symbol} onValueChange={setSelectedAsset}>
      <SelectTrigger disabled={disabled} data-testid={testIds.component.AssetSelector.trigger}>
        <div className="flex flex-row items-center gap-2">
          <TokenIcon token={selectedAsset} className="h-6 w-6" />
          <div className="typography-label-4">{selectedAsset.symbol}</div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {assets.map(({ token, balance }) => (
          <SelectItem key={token.symbol} value={token.symbol}>
            <div
              className={cn('flex flex-row items-center justify-between', showBalance && 'min-w-56')}
              data-testid={testIds.component.AssetSelector.option}
            >
              <div className="flex flex-row items-center gap-2">
                <TokenIcon token={token} className="h-6 w-6" />
                <div className="typography-label-4">{token.symbol}</div>
              </div>
              {showBalance && (
                <div className="flex flex-col items-end gap-0.5">
                  <div className="typography-label-6 text-reskin-fg-quaternary">Balance</div>
                  <div className="typography-label-6 text-reskin-fg-primary">
                    {token.format(balance, { style: 'compact' })}
                  </div>
                </div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
