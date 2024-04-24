import BigNumber from 'bignumber.js'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { MarketInfo, Reserve, UserPosition } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export const AssetInputSchema = z.object({
  symbol: z.string().transform(TokenSymbol),
  value: z.string().refine(
    (data) => {
      const value = parseFloat(data)
      return data === '' || !isNaN(value)
    },
    {
      message: 'Value must be a valid number',
    },
  ),
  isMaxSelected: z.boolean().default(false),
})
export type AssetInputSchema = z.infer<typeof AssetInputSchema>

export interface DialogFormNormalizedData {
  position: UserPosition
  reserve: Reserve
  token: Token
  value: NormalizedUnitNumber
  isMaxSelected: boolean
}

export function normalizeDialogFormValues(asset: AssetInputSchema, marketInfo: MarketInfo): DialogFormNormalizedData {
  const token = marketInfo.findOneTokenBySymbol(asset.symbol)
  const position = marketInfo.findOnePositionBySymbol(asset.symbol)
  const value = NormalizedUnitNumber(asset.value === '' ? '0' : asset.value)

  return {
    position,
    reserve: position.reserve,
    token,
    value,
    isMaxSelected: asset.isMaxSelected,
  }
}

export function isMaxValue(value: string, maxValue: NormalizedUnitNumber): boolean {
  const normalizedValue = NormalizedUnitNumber(value === '' ? '0' : value)
  return normalizedValue.eq(maxValue)
}

export function getActionAsset(
  form: UseFormReturn<AssetInputSchema>,
  marketInfo: MarketInfo,
  maxValue: NormalizedUnitNumber,
): DialogFormNormalizedData {
  const formValue = form.watch()
  const formAsset = normalizeDialogFormValues(formValue, marketInfo)
  const assetValue = NormalizedUnitNumber(BigNumber.min(formAsset.value, maxValue))
  return { ...formAsset, value: assetValue }
}
