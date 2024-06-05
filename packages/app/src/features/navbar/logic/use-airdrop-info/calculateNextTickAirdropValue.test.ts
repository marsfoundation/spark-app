import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { calculateNextTickAirdropValue } from './calculateNextTickAirdropValue'

describe(calculateNextTickAirdropValue.name, () => {
  it('should calculate next airdrop value for small ticks', () => {
    const currentValue = NormalizedUnitNumber(100)
    const tokenRatePerSecond = NormalizedUnitNumber(1000)
    const refreshInterval = 10 // 10ms

    const result = calculateNextTickAirdropValue(currentValue, tokenRatePerSecond, refreshInterval)

    const expectedResult = NormalizedUnitNumber(110)

    expect(result).toEqual(expectedResult)
  })

  it('should calculate next airdrop value for large ticks', () => {
    const currentValue = NormalizedUnitNumber(100)
    const tokenRatePerSecond = NormalizedUnitNumber(1000)
    const refreshInterval = 10000 // 10 seconds

    const result = calculateNextTickAirdropValue(currentValue, tokenRatePerSecond, refreshInterval)

    const expectedResult = NormalizedUnitNumber(10100)

    expect(result).toEqual(expectedResult)
  })
})
