import { calculateGemConversionFactor } from '@/features/actions/utils/savings'
import { BaseUnitNumber, toBigInt } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import BigNumber from 'bignumber.js'

export interface CalculateGemMinAmountOutParams {
  gemDecimals: number
  assetsTokenDecimals: number
  assetsAmount: bigint
}

export function calculateGemMinAmountOut({
  gemDecimals,
  assetsTokenDecimals,
  assetsAmount,
}: CalculateGemMinAmountOutParams): bigint {
  const gemConversionFactor = calculateGemConversionFactor({ gemDecimals, assetsTokenDecimals })
  const gemMinAmountOut = BaseUnitNumber(
    NormalizedUnitNumber(assetsAmount).dividedBy(gemConversionFactor).integerValue(BigNumber.ROUND_DOWN),
  )
  return toBigInt(gemMinAmountOut)
}
