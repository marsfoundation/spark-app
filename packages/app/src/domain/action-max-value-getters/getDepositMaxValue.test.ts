import { bigNumberify } from '@/utils/bigNumber'

import { NormalizedUnitNumber } from '../types/NumericValues'
import { getDepositMaxValue } from './getDepositMaxValue'

const assetParams = {
  decimals: 8,
  index: bigNumberify('1000184375813842487460564746'),
  rate: bigNumberify('521468880203607399181048'),
  lastUpdateTimestamp: 0,
}

describe(getDepositMaxValue.name, () => {
  describe('not active reserve', () => {
    test('returns 0 for frozen reserve', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'frozen',
            totalLiquidity: NormalizedUnitNumber(0),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(0))
    })

    test('returns 0 for paused reserve', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'paused',
            totalLiquidity: NormalizedUnitNumber(0),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(0))
    })
  })

  describe('no supply cap', () => {
    test('returns 0 when no balance', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(0) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(10),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(0))
    })

    test('returns balance', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(0),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(100))
    })
  })

  describe('supply cap', () => {
    test('returns 0 when no balance', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(0) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(0),
            supplyCap: NormalizedUnitNumber(100),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(0))
    })

    test('returns 0 when supply cap reached', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(100),
            supplyCap: NormalizedUnitNumber(100),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(0))
    })

    test('returns supply cap when balance is greater than supply cap', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(0),
            supplyCap: NormalizedUnitNumber(50),
            totalDebt: NormalizedUnitNumber(0),
            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(50))
    })

    test('returns available to supply value', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(25),
            supplyCap: NormalizedUnitNumber(50),
            totalDebt: NormalizedUnitNumber(0),

            ...assetParams,
          },
          timestamp: 0,
        }),
      ).toEqual(NormalizedUnitNumber(25))
    })

    test('returns available to supply value for growing liquidity', () => {
      expect(
        getDepositMaxValue({
          user: { balance: NormalizedUnitNumber(100) },
          asset: {
            status: 'active',
            totalLiquidity: NormalizedUnitNumber(25),
            supplyCap: NormalizedUnitNumber(50),
            totalDebt: NormalizedUnitNumber(20),
            ...assetParams,
          },
          timestamp: 10,
        }),
      ).toEqual(NormalizedUnitNumber(24.9999998)) // 0.0000002 will grow over the next 10 minutes
    })
  })
})
