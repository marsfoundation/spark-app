import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { adjustTokenReward } from './adjustTokenReward'

describe(adjustTokenReward.name, () => {
  it('should adjust the value when airdrop timestamp is smaller than current timestamp', () => {
    const params = {
      airdropTimestamp: 1000,
      currentTimestamp: 2000,
      tokenRatePerSecond: NormalizedUnitNumber(1),
      tokenReward: NormalizedUnitNumber(1),
    }

    expect(adjustTokenReward(params)).toEqual(NormalizedUnitNumber(1001))
  })

  it('should leave token reward same when airdrop and current timestamps are the same', () => {
    const params = {
      airdropTimestamp: 1000,
      currentTimestamp: 1000,
      tokenRatePerSecond: NormalizedUnitNumber(1),
      tokenReward: NormalizedUnitNumber(1),
    }

    expect(adjustTokenReward(params)).toEqual(NormalizedUnitNumber(1))
  })
})
