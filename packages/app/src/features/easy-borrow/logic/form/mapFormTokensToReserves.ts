import { ReserveWithValue, TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { EasyBorrowFormNormalizedData } from '../types'
import { UpgradeOptions } from '../useUpgradeOptions'

export interface MapFormTokensToReservesParams {
  formValues: EasyBorrowFormNormalizedData
  marketInfo: MarketInfo
  upgradeOptions?: UpgradeOptions
}

export interface MapFormTokensToReservesResult {
  borrows: ReserveWithValue[]
  deposits: ReserveWithValue[]
}

export function mapFormTokensToReserves({
  formValues,
  marketInfo,
  upgradeOptions,
}: MapFormTokensToReservesParams): MapFormTokensToReservesResult {
  function mapToReserve({ token, value }: TokenWithValue): ReserveWithValue {
    // @note: Replacing usds with dai - as borrowing usds creates dai market borrow position
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
