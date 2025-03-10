import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface ClaimableReward {
  token: Token
  amountPending: NormalizedUnitNumber
  amountToClaim: NormalizedUnitNumber
  chainId: number
}

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
