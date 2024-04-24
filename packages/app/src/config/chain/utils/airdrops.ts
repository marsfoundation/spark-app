import { Airdrop } from '@/config/chain/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { getChainConfigEntry } from '..'

export interface AirdropEntry {
  id: string
  amount: NormalizedUnitNumber
}
export interface AirdropsData {
  deposit: AirdropEntry[]
  borrow: AirdropEntry[]
}
export function getAirdropsData(chainId: number, tokenSymbol: TokenSymbol): AirdropsData {
  const { airdrop } = getChainConfigEntry(chainId)

  return {
    deposit: iterateAirdropData(airdrop, tokenSymbol, 'deposit'),
    borrow: iterateAirdropData(airdrop, tokenSymbol, 'borrow'),
  }
}

export function iterateAirdropData(airdrop: Airdrop, symbol: TokenSymbol, type: 'deposit' | 'borrow'): AirdropEntry[] {
  return Object.entries(airdrop)
    .map(([id, airdrop]) => {
      const airdropAmount = airdrop[symbol]?.[type]
      if (airdropAmount) {
        return { id, amount: airdropAmount }
      }
    })
    .filter(Boolean) as AirdropEntry[]
}
