import { describe, test } from 'vitest'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { GnosisSavingsInfo } from './gnosisSavingsInfo'

describe(GnosisSavingsInfo.name, () => {
  describe(GnosisSavingsInfo.prototype.predictAssetsAmount.name, () => {
    test('accounts for 5% apy', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsInfo.predictAssetsAmount({
        shares,
        timestamp: timestamp + 24 * 60 * 60,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(105)).abs().lt(1e-12)).toEqual(true)
    })

    test('accounts for 10% apy', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(36.5, true), // 10% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsInfo.predictAssetsAmount({
        shares,
        timestamp: timestamp + 24 * 60 * 60,
      })

      expect(fivePercentYield.minus(NormalizedUnitNumber(110)).abs().lt(1e-12)).toEqual(true)
    })
  })

  describe(GnosisSavingsInfo.prototype.predictSharesAmount.name, () => {
    test('accounts for 5% apy', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsInfo.predictSharesAmount({
        assets,
        timestamp: timestamp + 24 * 60 * 60,
      })

      expect(
        fivePercentYield
          .minus(NormalizedUnitNumber(NormalizedUnitNumber(100).dividedBy(1.05)))
          .abs()
          .lt(1e-12),
      ).toEqual(true)
    })

    test('accounts for 10% apy', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(36.5, true), // 10% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const fivePercentYield = savingsInfo.predictSharesAmount({
        assets,
        timestamp: timestamp + 24 * 60 * 60,
      })

      expect(
        fivePercentYield
          .minus(NormalizedUnitNumber(NormalizedUnitNumber(100).dividedBy(1.1)))
          .abs()
          .lt(1e-12),
      ).toEqual(true)
    })
  })
})
