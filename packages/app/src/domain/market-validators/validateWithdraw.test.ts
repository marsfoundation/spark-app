import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { validateWithdraw } from './validateWithdraw'

describe(validateWithdraw.name, () => {
  test('validates that value is positive', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(0),
        asset: { status: 'active', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe('value-not-positive')
  })

  test('works with active reserves', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe(undefined)
  })

  test('works with frozen reserves', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe(undefined)
  })

  test('validates that reserve is not paused', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'paused', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe('reserve-paused')
  })

  test('validates that reserve is active', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'not-active', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe('reserve-not-active')
  })

  test('validates balance', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(1), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe('exceeds-balance')
  })

  test('work with matching balance', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(0.5) },
      }),
    ).toBe(undefined)
  })

  test('validates health factor', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', maxLtv: Percentage(0.8) },
        user: { deposited: NormalizedUnitNumber(10), ltvAfterWithdrawal: Percentage(1) },
      }),
    ).toBe('exceeds-ltv')
  })
})
