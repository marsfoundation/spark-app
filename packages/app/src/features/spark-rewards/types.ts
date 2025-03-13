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
  rewardChainId: number
  involvedTokensSymbols: TokenSymbol[]
  restrictedCountryCodes: string[]
  engageButtonText: string
  onEngageButtonClick: () => void
} & (
  | {
      type: 'sparklend'
      chainId: number
    }
  | {
      type: 'savings'
      chainId: number
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
