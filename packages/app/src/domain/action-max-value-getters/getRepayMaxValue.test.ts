import { describe, test, expect } from 'bun:test'

import { NormalizedUnitNumber } from '../types/NumericValues'
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
        },
      }),
    ).toEqual(NormalizedUnitNumber(100))
  })
})
