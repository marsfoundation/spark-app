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
    .multipliedBy(maxLoanToValue.dp(2, BigNumber.ROUND_DOWN)) // ltv in smart contracts is always represented as 4 digits - 2 for integer part and 2 for decimal part
    .minus(totalBorrowsUSD)
    .dividedBy(borrowingAssetPriceUsd)

  return NormalizedUnitNumber(collateralBasedBorrowLimit)
}
