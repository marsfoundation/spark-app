import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { calculateMaxBorrowBasedOnCollateral } from './calculateMaxBorrowBasedOnCollateral'

describe(calculateMaxBorrowBasedOnCollateral.name, () => {
  it('calculates max borrow for an asset', () => {
    expect(
      calculateMaxBorrowBasedOnCollateral({
        totalCollateralUSD: NormalizedUnitNumber(5000),
        maxLoanToValue: Percentage(0.8),
        totalBorrowsUSD: NormalizedUnitNumber(1000),
        borrowingAssetPriceUsd: NormalizedUnitNumber(1500),
      }),
    ).toStrictEqual(NormalizedUnitNumber(2))
  })
})
