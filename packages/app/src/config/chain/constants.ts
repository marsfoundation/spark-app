import { AssetsGroup } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { base, mainnet } from 'viem/chains'

import { type Chain } from 'viem'

export const lastSepolia = {
  id: 11457,
  name: 'Last Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-devnet-a62hx4f2t5.t.conduit.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Conduit', url: 'https://explorer-devnet-a62hx4f2t5.t.conduit.xyz/' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
} as const satisfies Chain

export const lastSepoliaDynamic = {
  blockExplorerUrls: [lastSepolia.blockExplorers.default.url],
  chainId: lastSepolia.id,
  networkId: lastSepolia.id,
  chainName: 'devnet-a62hx4f2t5',
  name: lastSepolia.name,
  vanityName: lastSepolia.name,
  iconUrls: ['https://explorer-devnet-a62hx4f2t5.t.conduit.xyz/assets/configs/network_icon_dark.png'],
  nativeCurrency: {
    ...lastSepolia.nativeCurrency,
    iconUrl: 'https://explorer-devnet-a62hx4f2t5.t.conduit.xyz/assets/configs/network_icon_dark.png',
  },
  rpcUrls: [lastSepolia.rpcUrls.default.http[0]],
}

export const SUPPORTED_CHAINS = [lastSepolia] as const
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
