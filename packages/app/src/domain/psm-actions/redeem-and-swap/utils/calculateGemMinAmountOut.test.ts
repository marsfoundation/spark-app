import { getMockToken } from '@/test/integration/constants'
import { calculateGemMinAmountOut } from './calculateGemMinAmountOut'

describe(calculateGemMinAmountOut.name, () => {
  const gem = getMockToken({ decimals: 6 })
  const assetsToken = getMockToken({ decimals: 18 })

  it('caluclates the gem min value', () => {
    expect(calculateGemMinAmountOut({ gem, assetsToken, assetsAmount: 10n ** 18n })).toBe(10n ** 6n)
    expect(calculateGemMinAmountOut({ gem, assetsToken, assetsAmount: 999_000000000000000n })).toBe(999_000n)
    // with rounding
    expect(calculateGemMinAmountOut({ gem, assetsToken, assetsAmount: 123456_000000000000n })).toBe(123456n)
    expect(calculateGemMinAmountOut({ gem, assetsToken, assetsAmount: 123456_555555555555n })).toBe(123456n)
    expect(calculateGemMinAmountOut({ gem, assetsToken, assetsAmount: 123456_999999999999n })).toBe(123456n)
  })
})
