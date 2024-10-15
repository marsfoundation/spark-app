import { AssetsGroup } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { base, gnosis, mainnet } from 'viem/chains'

export const SUPPORTED_CHAINS = [mainnet, gnosis] as const
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

export const MAINNET_USDS_SKY_FARM_ADDRESS = CheckedAddress('0x0650CAF159C5A49f711e8169D4336ECB9b950275')

export const baseDevNetFarms = {
  skyUsds: CheckedAddress('0x711b139b1f20DFc4416bFf875402015aeB05B4F2'),
  skySpk: CheckedAddress('0x13EFb8E40149f04C59446b6dad0cdB884a37190E'),
  spkSky: CheckedAddress('0xdBa674e76d87C3E119705353D5ed3A1F50466D0f'),
  spkUsds: CheckedAddress('0xC936beb7437879ae35deaeD1781a70Cc31BB837c'),
}

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
