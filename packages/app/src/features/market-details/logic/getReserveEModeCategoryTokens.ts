import { MarketInfo, Reserve } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export function getReserveEModeCategoryTokens(marketInfo: MarketInfo, reserve: Reserve): TokenSymbol[] {
  const reserveEModeCategoryId = reserve.eModeCategory?.id
  if (reserveEModeCategoryId !== 1 && reserveEModeCategoryId !== 2) return []

  return marketInfo.reserves
    .filter((r) => r.eModeCategory?.id === reserveEModeCategoryId)
    .map((reserve) => reserve.token.symbol)
}
