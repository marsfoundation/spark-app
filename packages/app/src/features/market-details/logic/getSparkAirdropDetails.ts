import { AirdropEntry, getAirdropsData } from '@/config/chain/utils/airdrops'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

export interface getSparkAirdropDetailsParams {
  marketInfo: MarketInfo
  airdropEligibleToken: TokenSymbol
}

export interface SparkAirdropDetails {
  deposit?: AirdropEntry
  borrow?: AirdropEntry
}

export function getSparkAirdropDetails({
  marketInfo,
  airdropEligibleToken,
}: getSparkAirdropDetailsParams): SparkAirdropDetails {
  const airdropData = getAirdropsData(marketInfo.chainId, airdropEligibleToken)
  return {
    deposit: airdropData.deposit.find(isSparkAirdrop),
    borrow: airdropData.borrow.find(isSparkAirdrop),
  }
}

function isSparkAirdrop({ id }: { id: string }): boolean {
  return id === 'SPK'
}
