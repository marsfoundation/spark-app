import { describe, test } from 'vitest'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { GnosisSavings } from './gnosisSavingsInfo'

describe(GnosisSavings.name, () => {
  describe(GnosisSavings.prototype.predictSharesValue.name, () => {
    test('predicts for 5% apy', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsManager = new GnosisSavings({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsManager.predictSharesValue({
        shares,
        timestamp: timestamp + 24 * 60 * 60,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(105)).abs().lt(1e-12)).toEqual(true)
    })

    test('accounts for 10% apy', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsManager = new GnosisSavings({
        vaultAPY: Percentage(36.5, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsManager.predictSharesValue({
        shares,
        timestamp: timestamp + 24 * 60 * 60,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(110)).abs().lt(1e-12)).toEqual(true)
    })
  })
})
