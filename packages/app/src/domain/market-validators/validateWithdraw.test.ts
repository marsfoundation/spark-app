import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { validateWithdraw } from './validateWithdraw'

describe(validateWithdraw.name, () => {
  it('validates that value is positive', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(0),
        asset: { status: 'active', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe('value-not-positive')
  })

  it('works with active reserves', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe(undefined)
  })

  it('works with frozen reserves', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'frozen', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe(undefined)
  })

  it('validates that reserve is not paused', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'paused', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe('reserve-paused')
  })

  it('validates that reserve is active', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'not-active', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe('reserve-not-active')
  })

  it('validates balance', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(1),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe('exceeds-balance')
  })

  it('work with matching balance', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(0.5),
          eModeState: { enabled: false },
        },
      }),
    ).toBe(undefined)
  })

  it('validates health factor', () => {
    expect(
      validateWithdraw({
        value: NormalizedUnitNumber(10),
        asset: { status: 'active', liquidationThreshold: Percentage(0.8) },
        user: {
          deposited: NormalizedUnitNumber(10),
          ltvAfterWithdrawal: Percentage(1),
          eModeState: { enabled: false },
        },
      }),
    ).toBe('exceeds-ltv')
  })
})
