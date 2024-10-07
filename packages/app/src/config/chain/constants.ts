import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { gnosis, mainnet } from 'viem/chains'

export const SUPPORTED_CHAINS = [mainnet, gnosis] as const
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const MAINNET_USDS_SKY_FARM_ADDRESS = CheckedAddress('0x0650CAF159C5A49f711e8169D4336ECB9b950275')
