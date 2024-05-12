import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { validateSetUseAsCollateral, ValidateSetUseAsCollateralParams } from './validateSetUseAsCollateral'

describe(validateSetUseAsCollateral.name, () => {
  test('validates that value is not the same as existing setting', () => {
    expect(
      validateSetUseAsCollateral({
        useAsCollateral: true,
        asset: {
          balance: NormalizedUnitNumber(0),
          status: 'active',
          isUsedAsCollateral: true,
          maxLtv: Percentage(0.8),
        },
        user: {
          healthFactorAfterWithdrawal: new BigNumber(2),
          inIsolationMode: false,
          hasZeroLtvAssetsInCollateral: false,
        },
      }),
    ).toBe('collateral-already-enabled')

    expect(
      validateSetUseAsCollateral({
        useAsCollateral: false,
        asset: {
          balance: NormalizedUnitNumber(0),
          status: 'active',
          isUsedAsCollateral: false,
          maxLtv: Percentage(0.8),
        },
        user: {
          healthFactorAfterWithdrawal: new BigNumber(2),
          inIsolationMode: false,
          hasZeroLtvAssetsInCollateral: false,
        },
      }),
    ).toBe('collateral-already-disabled')
  })

  test('validates that asset balance is positive', () => {
    expect(
      validateSetUseAsCollateral({
        useAsCollateral: true,
        asset: {
          balance: NormalizedUnitNumber(0),
          status: 'active',
          isUsedAsCollateral: false,
          maxLtv: Percentage(0.8),
        },
        user: {
          healthFactorAfterWithdrawal: new BigNumber(2),
          inIsolationMode: false,
          hasZeroLtvAssetsInCollateral: false,
        },
      }),
    ).toBe('zero-deposit-asset')
  })

  test('validates that reserve is active', () => {
    const args: ValidateSetUseAsCollateralParams = {
      useAsCollateral: true,
      asset: {
        balance: NormalizedUnitNumber(10),
        status: 'not-active',
        isUsedAsCollateral: false,
        maxLtv: Percentage(0.8),
      },
      user: {
        healthFactorAfterWithdrawal: new BigNumber(2),
        inIsolationMode: false,
        hasZeroLtvAssetsInCollateral: false,
      },
    }

    expect(
      validateSetUseAsCollateral({
        ...args,
        asset: { ...args.asset, status: 'not-active' },
      }),
    ).toBe('reserve-not-active')

    expect(
      validateSetUseAsCollateral({
        ...args,
        asset: { ...args.asset, status: 'paused' },
      }),
    ).toBe('reserve-not-active')

    expect(
      validateSetUseAsCollateral({
        ...args,
        asset: { ...args.asset, status: 'frozen' },
      }),
    ).toBe('reserve-not-active')
  })

  describe('enabling collateral', () => {
    test('validates that maxLtv is not zero', () => {
      expect(
        validateSetUseAsCollateral({
          useAsCollateral: true,
          asset: {
            balance: NormalizedUnitNumber(10),
            status: 'active',
            isUsedAsCollateral: false,
            maxLtv: Percentage(0),
          },
          user: {
            healthFactorAfterWithdrawal: new BigNumber(2),
            inIsolationMode: false,
            hasZeroLtvAssetsInCollateral: false,
          },
        }),
      ).toBe('zero-ltv-asset')
    })

    test('validates that isolation mode is not active', () => {
      expect(
        validateSetUseAsCollateral({
          useAsCollateral: true,
          asset: {
            balance: NormalizedUnitNumber(10),
            status: 'active',
            isUsedAsCollateral: false,
            maxLtv: Percentage(0.8),
          },
          user: {
            healthFactorAfterWithdrawal: new BigNumber(2),
            inIsolationMode: true,
            hasZeroLtvAssetsInCollateral: false,
          },
        }),
      ).toBe('isolation-mode-active')
    })
  })

  describe('disabling collateral', () => {
    test('validates that ltv is not exceeded', () => {
      expect(
        validateSetUseAsCollateral({
          useAsCollateral: false,
          asset: {
            balance: NormalizedUnitNumber(10),
            status: 'active',
            isUsedAsCollateral: true,
            maxLtv: Percentage(0.8),
          },
          user: {
            healthFactorAfterWithdrawal: new BigNumber(0.9),
            inIsolationMode: false,
            hasZeroLtvAssetsInCollateral: false,
          },
        }),
      ).toBe('exceeds-ltv')
    })

    test('validates that there are no zero ltv assets used as collateral', () => {
      expect(
        validateSetUseAsCollateral({
          useAsCollateral: false,
          asset: {
            balance: NormalizedUnitNumber(10),
            status: 'active',
            isUsedAsCollateral: true,
            maxLtv: Percentage(0.8),
          },
          user: {
            healthFactorAfterWithdrawal: new BigNumber(2),
            inIsolationMode: false,
            hasZeroLtvAssetsInCollateral: true,
          },
        }),
      ).toBe('zero-ltv-assets-in-collateral')
    })
  })
})
