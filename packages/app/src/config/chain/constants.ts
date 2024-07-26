import { gnosis, mainnet } from 'viem/chains'

export const SUPPORTED_CHAINS = [mainnet, gnosis] as const
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const NST_DEV_CHAIN_ID = 314311
