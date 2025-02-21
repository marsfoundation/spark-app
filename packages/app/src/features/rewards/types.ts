import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export type ActiveRewardsQueryResult = SimplifiedQueryResult<ActiveReward[]>

export interface ActiveReward {
  token: Token
  amountPending: NormalizedUnitNumber
  amountToClaim: NormalizedUnitNumber
}

export type OngoingCampaignsQueryResult = SimplifiedQueryResult<OngoingCampaign[]>

export type OngoingCampaign = {
  id: string
  shortDescription: string
  longDescription: string
  rewardToken: Token
  involvedTokens: Token[]
  engage: () => void
} & (
  | {
      type: 'sparklend'
      chainId: number
      apy: Percentage
    }
  | {
      type: 'savings'
      chainId: number
      apy: Percentage
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
