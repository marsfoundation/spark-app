import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { adjustAirdropValue } from './adjustAirdropValue'

describe(adjustAirdropValue.name, () => {
  it('should adjust the value when airdrop timestamp is smaller than timestamp', () => {
    const airdrop = {
      timestamp: 1000,
      tokenRatePerSecond: NormalizedUnitNumber(1),
      tokenReward: NormalizedUnitNumber(1),
    }
    const timestamp = 2000

    const result = adjustAirdropValue(airdrop, timestamp)

    expect(result).toEqual(NormalizedUnitNumber(1001))
  })

  it('should adjust the value when airdrop timestamp is the same as timestamp', () => {
    const airdrop = {
      timestamp: 1000,
      tokenRatePerSecond: NormalizedUnitNumber(1),
      tokenReward: NormalizedUnitNumber(1),
    }
    const timestamp = 1000

    const result = adjustAirdropValue(airdrop, timestamp)

    expect(result).toEqual(NormalizedUnitNumber(1))
  })
})
