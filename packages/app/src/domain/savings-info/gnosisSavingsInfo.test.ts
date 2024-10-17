import { describe, test } from 'vitest'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { GnosisSavingsInfo } from './gnosisSavingsInfo'

describe(GnosisSavingsInfo.name, () => {
  describe(GnosisSavingsInfo.prototype.predictAssetsAmount.name, () => {
    test('calculates correct assets for given shares and future timestamp', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })

      const assetsAtFutureTime = savingsInfo.predictAssetsAmount({
        timestamp: timestamp + 24 * 60 * 60, // one day later
        shares,
      })

      const expectedAssets = shares.multipliedBy(1.05)
      expect(assetsAtFutureTime.minus(expectedAssets).abs().lt(1e-12)).toEqual(true)
    })

    test('predictAssetsAmount matches convertToAssets at current timestamp', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })

      const assetsViaPredict = savingsInfo.predictAssetsAmount({
        timestamp: savingsInfo.currentTimestamp,
        shares,
      })
      const assetsViaConvert = savingsInfo.convertToAssets({ shares })

      expect(assetsViaPredict.eq(assetsViaConvert)).toEqual(true)
    })
  })

  describe(GnosisSavingsInfo.prototype.predictSharesAmount.name, () => {
    test('calculates correct shares for given assets and future timestamp', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })
      const sharesAtFutureTime = savingsInfo.predictSharesAmount({
        timestamp: timestamp + 24 * 60 * 60, // one day later
        assets,
      })

      const expectedShares = assets.dividedBy(1.05)
      expect(sharesAtFutureTime.minus(expectedShares).abs().lt(1e-12)).toEqual(true)
    })

    test('predictSharesAmount matches convertToShares at current timestamp', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new GnosisSavingsInfo({
        vaultAPY: Percentage(18.25, true), // 5% / day
        totalAssets: NormalizedUnitNumber(100),
        totalSupply: NormalizedUnitNumber(100),
        currentTimestamp: timestamp,
      })

      const sharesViaPredict = savingsInfo.predictSharesAmount({
        timestamp: savingsInfo.currentTimestamp,
        assets,
      })
      const sharesViaConvert = savingsInfo.convertToShares({ assets })

      expect(sharesViaPredict.eq(sharesViaConvert)).toEqual(true)
    })
  })
})
