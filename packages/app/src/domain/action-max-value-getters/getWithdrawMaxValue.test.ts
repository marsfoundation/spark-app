import { NormalizedUnitNumber } from '../types/NumericValues'
import { getWithdrawMaxValue } from './getWithdrawMaxValue'

describe(getWithdrawMaxValue.name, () => {
  test('returns 0 for paused reserve', () => {
    expect(
      getWithdrawMaxValue({
        user: { deposited: NormalizedUnitNumber(100) },
        asset: { status: 'paused' },
      }),
    ).toEqual(NormalizedUnitNumber(0))
  })

  test('returns deposited amount', () => {
    expect(
      getWithdrawMaxValue({
        user: { deposited: NormalizedUnitNumber(100) },
        asset: { status: 'active' },
      }),
    ).toEqual(NormalizedUnitNumber(100))
  })
})
