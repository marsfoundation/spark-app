import { getAirdropsData } from '@/config/chain/utils/airdrops'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface getSparkAirdropDetailsParams {
  marketInfo: MarketInfo
  token: TokenSymbol
}

export interface SparkAirdropDetails {
  hasAirdropForSupplying: boolean
  hasAirdropForBorrowing: boolean
}

export function getSparkAirdropDetails({ marketInfo, token }: getSparkAirdropDetailsParams): SparkAirdropDetails {
  const airdropData = getAirdropsData(marketInfo.chainId, token)
  return {
    hasAirdropForSupplying: airdropData.deposit.some(isSparkAirdrop),
    hasAirdropForBorrowing: airdropData.borrow.some(isSparkAirdrop),
  }
}

function isSparkAirdrop(token: TokenSymbol): boolean {
  return token === TokenSymbol('SPK')
}
