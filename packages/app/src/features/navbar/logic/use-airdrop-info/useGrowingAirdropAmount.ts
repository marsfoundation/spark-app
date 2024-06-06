import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { useTimestamp } from '@/utils/useTimestamp'
import { Airdrop } from '../../types'
import { adjustTokenReward } from './utils/adjustTokenReward'

export function useGrowingAirdropAmount(airdrop: Airdrop, enabled: boolean): NormalizedUnitNumber {
  const { timestampInMs } = useTimestamp({
    refreshIntervalInMs: enabled ? airdrop.refreshIntervalInMs : 0,
  })

  return adjustTokenReward({
    airdropTimestampInMs: airdrop.timestampInMs,
    currentTimestampInMs: timestampInMs,
    tokenRatePerSecond: airdrop.tokenRatePerSecond,
    tokenReward: airdrop.tokenReward,
  })
}
