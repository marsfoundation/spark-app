import { getAirdropsData } from '@/config/chain/utils/airdrops'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface getSparkAirdropDetailsParams {
  marketInfo: MarketInfo
  airdropEligibleToken: TokenSymbol
}

export interface SparkAirdropDetails {
  hasAirdropForSupplying: boolean
  hasAirdropForBorrowing: boolean
}

export function getSparkAirdropDetails({
  marketInfo,
  airdropEligibleToken,
}: getSparkAirdropDetailsParams): SparkAirdropDetails {
  const airdropData = getAirdropsData(marketInfo.chainId, airdropEligibleToken)
  return {
    hasAirdropForSupplying: airdropData.deposit.some(isSparkAirdrop),
    hasAirdropForBorrowing: airdropData.borrow.some(isSparkAirdrop),
  }
}

function isSparkAirdrop({ id }: { id: string }): boolean {
  return id === 'SPK'
}
