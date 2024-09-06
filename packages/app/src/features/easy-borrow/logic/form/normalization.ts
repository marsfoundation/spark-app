import { ReserveWithValue, TokenWithBalance } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { getChainConfigEntry } from '@/config/chain'
import { raise } from '@/utils/assert'
import { EasyBorrowFormNormalizedData } from '../types'
import type { AssetInputSchema, EasyBorrowFormSchema } from './validation'

export interface NormalizeFormValuesParams {
  values: EasyBorrowFormSchema
  marketInfo: MarketInfo
  allTokens: TokenWithBalance[]
}

export function normalizeFormValues({
  values,
  marketInfo,
  allTokens,
}: NormalizeFormValuesParams): EasyBorrowFormNormalizedData {
  const tokenToReserveToken = getChainConfigEntry(marketInfo.chainId).easyBorrowConfig.tokenToReserveToken ?? {}

  function normalizeAsset(asset: AssetInputSchema): ReserveWithValue {
    const value = NormalizedUnitNumber(asset.value === '' ? '0' : asset.value)

    if (tokenToReserveToken[asset.symbol]) {
      const reserve = marketInfo.findOneReserveBySymbol(tokenToReserveToken[asset.symbol]!)
      const syntheticReserve = {
        ...reserve,
        token: allTokens.find((t) => t.token.symbol === asset.symbol)?.token ?? raise('Token not found'),
      }

      return {
        reserve: syntheticReserve,
        value,
      }
    }

    const reserve = marketInfo.findOneReserveBySymbol(asset.symbol)
    return {
      reserve,
      value,
    }
  }

  return {
    borrows: values.assetsToBorrow.map(normalizeAsset),
    deposits: values.assetsToDeposit.map(normalizeAsset),
  }
}
