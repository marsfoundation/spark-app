import { ReserveWithValue, TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { EasyBorrowFormNormalizedData } from '../types'
import { UpgradeOptions } from '../useUpgradeOptions'

export interface MapFormValuesToPositionsParams {
  formValues: EasyBorrowFormNormalizedData
  marketInfo: MarketInfo
  upgradeOptions?: UpgradeOptions
}

export interface GetFormValuesAsUnderlyingReservesResult {
  borrows: ReserveWithValue[]
  deposits: ReserveWithValue[]
}

export function getFormValuesAsUnderlyingReserves({
  formValues,
  marketInfo,
  upgradeOptions,
}: MapFormValuesToPositionsParams): GetFormValuesAsUnderlyingReservesResult {
  function mapToReserve({ token, value }: TokenWithValue): ReserveWithValue {
    // @note: Form values can have usds as a token, but created position won't include usds, but only dai
    const tokenSymbol =
      token.symbol === upgradeOptions?.usds.token.symbol ? upgradeOptions.dai.token.symbol : token.symbol
    const reserve = marketInfo.findOneReserveBySymbol(tokenSymbol)
    return {
      reserve,
      value,
    }
  }
  return {
    borrows: formValues.borrows.map(mapToReserve),
    deposits: formValues.deposits.map(mapToReserve),
  }
}
