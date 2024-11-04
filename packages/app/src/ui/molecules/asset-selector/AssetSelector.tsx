import React from 'react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { assets as uiAssets } from '@/ui/assets'
import { FormControl } from '@/ui/atoms/form/Form'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/atoms/select/Select'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'

interface AssetSelectorProps {
  assets: { token: Token; balance?: NormalizedUnitNumber }[]
  selectedAsset?: Token
  setSelectedAsset?: (newSymbol: TokenSymbol) => void
  withFormControl?: boolean
  disabled?: boolean
  open?: boolean
}

export function AssetSelector({
  assets,
  selectedAsset,
  setSelectedAsset,
  withFormControl,
  disabled,
  open,
}: AssetSelectorProps) {
  const Wrapper = withFormControl ? FormControl : React.Fragment

  if ((assets.length === 1 && selectedAsset?.symbol === assets[0]!.token.symbol) || assets.length === 0) {
    return (
      <div
        className="flex h-14 w-36 flex-row items-center justify-center rounded-sm border border-input bg-input-background ring-offset-background"
        data-testid={testIds.component.AssetSelector.trigger}
      >
        {selectedAsset ? (
          <div className="flex" data-testid={testIds.component.AssetSelector.option}>
            <TokenIcon token={selectedAsset} className="h-6 w-6" />
            <Typography className="ml-2 text-prompt-foreground">{selectedAsset.symbol}</Typography>
          </div>
        ) : (
          '-'
        )}
      </div>
    )
  }

  return (
    <Select open={open} value={selectedAsset?.symbol} onValueChange={setSelectedAsset}>
      <SelectTrigger disabled={disabled} className="h-14 w-36" data-testid={testIds.component.AssetSelector.trigger}>
        <Wrapper>
          <div className="flex flex-row items-center gap-2">
            {selectedAsset && <TokenIcon token={selectedAsset} className="h-6 w-6" />}
            <Typography className="text-white">{selectedAsset?.symbol}</Typography>
          </div>
        </Wrapper>
      </SelectTrigger>
      <SelectContent>
        {assets.map((a) => (
          <SelectItem key={a.token.symbol} value={a.token.symbol}>
            <div className={cn('flex flex-row justify-between', a.balance && 'w-40')}>
              <div className="flex flex-row gap-2" data-testid={testIds.component.AssetSelector.option}>
                <TokenIcon token={a.token} className="h-6 w-6" />
                <Typography className="text-prompt-foreground">{a.token.symbol}</Typography>
              </div>
              {a.balance && (
                <div className="flex flex-row items-center">
                  <Typography variant="prompt">{a.token.format(a.balance, { style: 'compact' })}</Typography>
                  <img className="ml-2" src={uiAssets.wallet} alt="wallet" />
                </div>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
