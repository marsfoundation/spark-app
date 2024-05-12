import { NormalizedUnitNumber } from '../types/NumericValues'
import { validateRepay } from './validateRepay'

describe(validateRepay.name, () => {
  test('validates that value is positive', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(0),
        asset: { status: 'active' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe('value-not-positive')
  })

  test('works with active reserves', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe(undefined)
  })

  test('works with frozen reserves', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe(undefined)
  })

  test('validates that reserve is not paused', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'paused' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe('reserve-paused')
  })

  test('validates that reserve is active', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'not-active' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe('reserve-not-active')
  })

  test('validates debt', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active' },
        user: { debt: NormalizedUnitNumber(1), balance: NormalizedUnitNumber(10) },
      }),
    ).toBe('exceeds-debt')
  })

  test('validates balance', () => {
    expect(
      validateRepay({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active' },
        user: { debt: NormalizedUnitNumber(10), balance: NormalizedUnitNumber(1) },
      }),
    ).toBe('exceeds-balance')
  })
})
