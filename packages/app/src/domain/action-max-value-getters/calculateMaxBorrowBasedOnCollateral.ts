import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

interface CalculateMaxBorrowBasedOnCollateralParams {
  totalCollateralUSD: NormalizedUnitNumber
  totalBorrowsUSD: NormalizedUnitNumber
  maxLoanToValue: Percentage
  borrowingAssetPriceUsd: BigNumber
}

export function calculateMaxBorrowBasedOnCollateral({
  totalCollateralUSD,
  totalBorrowsUSD,
  maxLoanToValue,
  borrowingAssetPriceUsd,
}: CalculateMaxBorrowBasedOnCollateralParams): NormalizedUnitNumber {
  const collateralBasedBorrowLimit = totalCollateralUSD
    .multipliedBy(maxLoanToValue)
    .minus(totalBorrowsUSD)
    .dividedBy(borrowingAssetPriceUsd)

  return NormalizedUnitNumber(collateralBasedBorrowLimit)
}
