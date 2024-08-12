import { calculateGemMinAmountOut } from './calculateGemMinAmountOut'
import { describe, expect, test } from 'vitest'

describe(calculateGemMinAmountOut.name, () => {
  const gemDecimals = 6
  const assetsTokenDecimals = 18

  test('caluclates the gem min value', () => {
    expect(
      calculateGemMinAmountOut({
        gemDecimals,
        assetsTokenDecimals,
        assetsAmount: 10n ** 18n,
      }),
    ).toBe(10n ** 6n)

    expect(
      calculateGemMinAmountOut({
        gemDecimals,
        assetsTokenDecimals,
        assetsAmount: 999_000000000000000n,
      }),
    ).toBe(999_000n)

    // with rounding
    expect(
      calculateGemMinAmountOut({
        gemDecimals,
        assetsTokenDecimals,
        assetsAmount: 123456_000000000000n,
      }),
    ).toBe(123456n)

    expect(
      calculateGemMinAmountOut({
        gemDecimals,
        assetsTokenDecimals,
        assetsAmount: 123456_555555555555n,
      }),
    ).toBe(123456n)

    expect(
      calculateGemMinAmountOut({
        gemDecimals,
        assetsTokenDecimals,
        assetsAmount: 123456_999999999999n,
      }),
    ).toBe(123456n)
  })
})