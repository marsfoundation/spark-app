import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { toBigInt } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { calculateGemConversionFactor } from '../../utils/calculateGemConversionFactor'

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
  const gemMinAmountOut = NormalizedUnitNumber(assetsAmount)
    .dividedBy(gemConversionFactor)
    .integerValue(BigNumber.ROUND_DOWN)
  return toBigInt(gemMinAmountOut)
}
