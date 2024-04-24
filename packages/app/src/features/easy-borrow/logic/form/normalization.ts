import { ReserveWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { EasyBorrowFormNormalizedData } from '../types'
import type { AssetInputSchema, EasyBorrowFormSchema } from './validation'

export function normalizeFormValues(
  values: EasyBorrowFormSchema,
  marketInfo: MarketInfo,
): EasyBorrowFormNormalizedData {
  function normalizeAsset(asset: AssetInputSchema): ReserveWithValue {
    const reserve = marketInfo.findOneReserveBySymbol(asset.symbol)
    return {
      reserve,
      value: NormalizedUnitNumber(asset.value === '' ? '0' : asset.value),
    }
  }

  return {
    borrows: values.assetsToBorrow.map(normalizeAsset),
    deposits: values.assetsToDeposit.map(normalizeAsset),
  }
}
