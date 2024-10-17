import { describe, test } from 'vitest'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'

import { PotSavingsInfo } from './potSavingsInfo'

describe(PotSavingsInfo.name, () => {
  describe(PotSavingsInfo.prototype.convertToAssets.name, () => {
    test('accounts for dsr with 5% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const fivePercentYield = savingsInfo.convertToAssets({
        shares,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(105)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for dsr with 10% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const tenPercentYield = savingsInfo.convertToAssets({
        shares,
      })
      expect(tenPercentYield.minus(NormalizedUnitNumber(110)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi with 5% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })

      const fivePercentYield = savingsInfo.convertToAssets({
        shares,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(110.25)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi with 10% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const tenPercentYield = savingsInfo.convertToAssets({
        shares,
      })
      expect(tenPercentYield.minus(NormalizedUnitNumber(115.5)).abs().lt(1e-18)).toEqual(true)
    })
  })

  describe(PotSavingsInfo.prototype.convertToShares.name, () => {
    test('accounts for dsr', () => {
      const timestamp = 1000
      const dai = NormalizedUnitNumber(105)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const result = savingsInfo.convertToShares({
        assets: dai,
      })
      expect(result.minus(NormalizedUnitNumber(100)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi', () => {
      const timestamp = 1000
      const dai = NormalizedUnitNumber(110.25)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const result = savingsInfo.convertToShares({
        assets: dai,
      })
      expect(result.minus(NormalizedUnitNumber(100)).abs().lt(1e-18)).toEqual(true)
    })
  })

  describe(PotSavingsInfo.prototype.predictAssetsAmount.name, () => {
    test('calculates correct assets for given shares and future timestamp', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp,
      })

      const assetsAtFutureTime = savingsInfo.predictAssetsAmount({
        timestamp: timestamp + 24 * 60 * 60, // one day later
        shares,
      })

      const expectedAssets = NormalizedUnitNumber(105)
      expect(assetsAtFutureTime.minus(expectedAssets).abs().lt(1e-12)).toEqual(true)
    })

    test('predictAssetsAmount matches convertToAssets at current timestamp', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60, // one day later
      })

      const assetsViaPredict = savingsInfo.predictAssetsAmount({
        timestamp: savingsInfo.currentTimestamp,
        shares,
      })
      const assetsViaConvert = savingsInfo.convertToAssets({ shares })

      expect(assetsViaPredict.minus(assetsViaConvert).abs().lt(1e-12)).toEqual(true)
    })
  })

  describe(PotSavingsInfo.prototype.predictSharesAmount.name, () => {
    test('calculates correct shares for given assets and future timestamp', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp,
      })

      const sharesAtFutureTime = savingsInfo.predictSharesAmount({
        timestamp: savingsInfo.currentTimestamp + 24 * 60 * 60, // one day later
        assets,
      })

      const expectedShares = assets.dividedBy(1.05)
      expect(sharesAtFutureTime.minus(expectedShares).abs().lt(1e-12)).toEqual(true)
    })

    test('predictSharesAmount matches convertToShares at current timestamp', () => {
      const timestamp = 1000
      const assets = NormalizedUnitNumber(100)
      const savingsInfo = new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp,
      })

      const sharesViaPredict = savingsInfo.predictSharesAmount({
        timestamp: savingsInfo.currentTimestamp,
        assets,
      })
      const sharesViaConvert = savingsInfo.convertToShares({ assets })

      expect(sharesViaPredict.minus(sharesViaConvert).abs().lt(1e-12)).toEqual(true)
    })
  })
})
