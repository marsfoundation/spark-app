import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber } from '../types/NumericValues'

interface GetBorrowMaxValueParams {
  asset: {
    availableLiquidity: NormalizedUnitNumber
  }
  user: {
    maxBorrowBasedOnCollateral: NormalizedUnitNumber
    inIsolationMode?: boolean
    isolationModeCollateralTotalDebt?: NormalizedUnitNumber
    isolationModeCollateralDebtCeiling?: NormalizedUnitNumber
  }
  validationIssue?: string
}

export function getBorrowMaxValue({ asset, user, validationIssue }: GetBorrowMaxValueParams): NormalizedUnitNumber {
  if (
    validationIssue === 'reserve-not-active' ||
    validationIssue === 'reserve-borrowing-disabled' ||
    validationIssue === 'asset-not-borrowable-in-isolation' ||
    validationIssue === 'siloed-mode-cannot-enable' ||
    validationIssue === 'siloed-mode-enabled' ||
    validationIssue === 'emode-category-mismatch'
  ) {
    return NormalizedUnitNumber(0)
  }

  const ceilings = [asset.availableLiquidity, user.maxBorrowBasedOnCollateral]
  const { inIsolationMode, isolationModeCollateralTotalDebt, isolationModeCollateralDebtCeiling } = user

  if (inIsolationMode && isolationModeCollateralTotalDebt && isolationModeCollateralDebtCeiling) {
    ceilings.push(NormalizedUnitNumber(isolationModeCollateralDebtCeiling.minus(isolationModeCollateralTotalDebt)))
  }

  return NormalizedUnitNumber(BigNumber.min(...ceilings))
}
