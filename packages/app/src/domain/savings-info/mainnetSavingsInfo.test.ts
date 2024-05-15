import { describe, test } from 'vitest'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { bigNumberify } from '@/utils/bigNumber'

import { MainnetSavingsInfo } from './mainnetSavingsInfo'

describe(MainnetSavingsInfo.name, () => {
  describe(MainnetSavingsInfo.prototype.convertSharesToDai.name, () => {
    test('accounts for dsr with 5% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const fivePercentYield = savingsInfo.convertSharesToDai({
        shares,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(105)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for dsr with 10% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const tenPercentYield = savingsInfo.convertSharesToDai({
        shares,
      })
      expect(tenPercentYield.minus(NormalizedUnitNumber(110)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi with 5% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })

      const fivePercentYield = savingsInfo.convertSharesToDai({
        shares,
      })
      expect(fivePercentYield.minus(NormalizedUnitNumber(110.25)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi with 10% yield', () => {
      const timestamp = 1000
      const shares = NormalizedUnitNumber(100)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000001103127689513476993127'), // 10% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const tenPercentYield = savingsInfo.convertSharesToDai({
        shares,
      })
      expect(tenPercentYield.minus(NormalizedUnitNumber(115.5)).abs().lt(1e-18)).toEqual(true)
    })
  })

  describe(MainnetSavingsInfo.prototype.convertDaiToShares.name, () => {
    test('accounts for dsr', () => {
      const timestamp = 1000
      const dai = NormalizedUnitNumber(105)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1000000000000000000000000000'), // 1
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const result = savingsInfo.convertDaiToShares({
        dai,
      })
      expect(result.minus(NormalizedUnitNumber(100)).abs().lt(1e-18)).toEqual(true)
    })

    test('accounts for chi', () => {
      const timestamp = 1000
      const dai = NormalizedUnitNumber(110.25)
      const savingsInfo = new MainnetSavingsInfo({
        potParams: {
          dsr: bigNumberify('1000000564701133626865910626'), // 5% / day
          rho: bigNumberify(timestamp),
          chi: bigNumberify('1050000000000000000000000000'), // 1.05
        },
        currentTimestamp: timestamp + 24 * 60 * 60,
      })
      const result = savingsInfo.convertDaiToShares({
        dai,
      })
      expect(result.minus(NormalizedUnitNumber(100)).abs().lt(1e-18)).toEqual(true)
    })
  })
})
