import { AirdropsPerAction } from '@/config/chain/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { getChainConfigEntry } from '..'

export function getAirdropsData(chainId: number, airdropEligibleToken: TokenSymbol): AirdropsPerAction {
  const { airdrop } = getChainConfigEntry(chainId)
  return airdrop[airdropEligibleToken] ?? { deposit: [], borrow: [] }
}
