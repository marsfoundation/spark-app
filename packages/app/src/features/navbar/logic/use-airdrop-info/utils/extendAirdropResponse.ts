import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Airdrop } from '@/features/navbar/types'
import { adjustTokenReward } from './adjustTokenReward'
import { getTokenRatePerInterval } from './getTokenRatePerInterval'
import { getTokenRatePrecision } from './getTokenRatePrecision'

export interface ExtendAirdropResponseParams {
  airdropTimestamp: number
  currentTimestamp: number
  tokenRatePerSecond: NormalizedUnitNumber
  tokenReward: NormalizedUnitNumber
  refreshIntervalInMs: number
}

export function extendAirdropResponse(params: ExtendAirdropResponseParams): Airdrop {
  const tokenRewardAdjusted = adjustTokenReward(params)
  const { tokenRatePerSecond, refreshIntervalInMs } = params
  const tokenRatePrecision = getTokenRatePrecision({ tokenRatePerSecond, refreshIntervalInMs })
  const tokenRatePerInterval = getTokenRatePerInterval({ tokenRatePerSecond, refreshIntervalInMs })

  return {
    tokenReward: tokenRewardAdjusted,
    refreshIntervalInMs,
    tokenRatePerInterval,
    tokenRatePrecision,
  }
}
