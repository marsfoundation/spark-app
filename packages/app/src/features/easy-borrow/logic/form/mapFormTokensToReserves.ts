import { ReserveWithValue, TokenWithValue } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { EasyBorrowFormNormalizedData } from '../types'

export interface MapFormTokensToReservesParams {
  formValues: EasyBorrowFormNormalizedData
  marketInfo: MarketInfo
}

export interface MapFormTokensToReservesResult {
  borrows: ReserveWithValue[]
  deposits: ReserveWithValue[]
}

export function mapFormTokensToReserves({
  formValues,
  marketInfo,
}: MapFormTokensToReservesParams): MapFormTokensToReservesResult {
  function mapToReserve({ token, value }: TokenWithValue): ReserveWithValue {
    const reserve = marketInfo.findOneReserveBySymbol(token.symbol)
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
