import { AssetsGroup } from '@/domain/farms/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { base, gnosis, mainnet } from 'viem/chains'

export const SUPPORTED_CHAINS = [mainnet, base, gnosis] as const
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const farmStablecoinsEntryGroup: Record<1 | 8453, AssetsGroup> = {
  [mainnet.id]: {
    type: 'stablecoins',
    name: 'Stablecoins',
    assets: [TokenSymbol('DAI'), TokenSymbol('USDC'), TokenSymbol('USDS'), TokenSymbol('sDAI'), TokenSymbol('sUSDS')],
  },
  [base.id]: {
    type: 'stablecoins',
    name: 'Stablecoins',
    assets: [TokenSymbol('USDS'), TokenSymbol('sUSDS'), TokenSymbol('USDC')],
  },
}

export const farmAddresses = {
  [mainnet.id]: {
    chroniclePoints: CheckedAddress('0x10ab606B067C9C461d8893c47C7512472E19e2Ce'),
    skyUsds: CheckedAddress('0x0650CAF159C5A49f711e8169D4336ECB9b950275'),
  },
  [base.id]: {
    skyUsds: CheckedAddress('0x711b139b1f20DFc4416bFf875402015aeB05B4F2'),
  },
} as const

export const susdsAddresses = {
  [mainnet.id]: CheckedAddress('0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD'),
} as const
