import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { useTimestamp } from '@/utils/useTimestamp'
import { Airdrop } from '../../types'
import { adjustTokenReward } from './utils/adjustTokenReward'

export function useGrowingAirdropAmount(airdrop: Airdrop, enabled: boolean): NormalizedUnitNumber {
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs: enabled && airdrop.tokenRatePerSecond.gt(0) ? airdrop.refreshIntervalInMs : undefined,
  })

  return adjustTokenReward({
    airdropTimestampInMs: airdrop.timestampInMs,
    currentTimestampInMs: timestampInMs,
    tokenRatePerSecond: airdrop.tokenRatePerSecond,
    tokenReward: airdrop.tokenReward,
  })
}
