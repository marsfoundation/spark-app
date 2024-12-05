import { describe, test } from 'vitest'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { getRepayMaxValue } from './getRepayMaxValue'

describe(getRepayMaxValue.name, () => {
  test('returns 0 for paused reserve', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(100),
          balance: NormalizedUnitNumber(100),
        },
        asset: {
          status: 'paused',
          isNativeAsset: false,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0),
        },
      }),
    ).toEqual(NormalizedUnitNumber(0))
  })

  test('returns 0 when no debt', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(0),
          balance: NormalizedUnitNumber(100),
        },
        asset: {
          status: 'active',
          isNativeAsset: false,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0),
        },
      }),
    ).toEqual(NormalizedUnitNumber(0))
  })

  test('returns 0 when no balance', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(100),
          balance: NormalizedUnitNumber(0),
        },
        asset: {
          status: 'active',
          isNativeAsset: false,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0),
        },
      }),
    ).toEqual(NormalizedUnitNumber(0))
  })

  test('returns debt when balance is greater', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(100),
          balance: NormalizedUnitNumber(200),
        },
        asset: {
          status: 'active',
          isNativeAsset: false,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0),
        },
      }),
    ).toEqual(NormalizedUnitNumber(100))
  })

  test('returns balance when debt is greater', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(200),
          balance: NormalizedUnitNumber(100),
        },
        asset: {
          status: 'active',
          isNativeAsset: false,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0),
        },
      }),
    ).toEqual(NormalizedUnitNumber(100))
  })

  test('leaves some native asset when returning balance', () => {
    expect(
      getRepayMaxValue({
        user: {
          debt: NormalizedUnitNumber(200),
          balance: NormalizedUnitNumber(100),
        },
        asset: {
          status: 'active',
          isNativeAsset: true,
        },
        chain: {
          minRemainingNativeAsset: NormalizedUnitNumber(0.01),
        },
      }),
    ).toEqual(NormalizedUnitNumber(99.99))
  })
})
