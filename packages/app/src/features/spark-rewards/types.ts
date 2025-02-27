import { TokenSymbol } from '@/domain/types/TokenSymbol'

export type OngoingCampaignRow = {
  id: string
  shortDescription: string
  longDescription: string
  rewardTokenSymbol: TokenSymbol
  chainId: number
  involvedTokensSymbols: TokenSymbol[]
  restrictedCountryCodes: string[]
} & (
  | {
      type: 'sparklend'
    }
  | {
      type: 'savings'
    }
  | {
      type: 'social'
      platform: 'x' | 'discord'
      link: string
    }
  | {
      type: 'external'
      link: string
    }
)
