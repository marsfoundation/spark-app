import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { toBigInt } from '@/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { calculateGemConversionFactor } from '../../utils/calculateGemConversionFactor'

export interface CalculateGemMinAmountOutParams {
  gem: Token
  assetsToken: Token
  assetsAmount: bigint
}

export function calculateGemMinAmountOut({ gem, assetsToken, assetsAmount }: CalculateGemMinAmountOutParams): bigint {
  const gemConversionFactor = calculateGemConversionFactor({ gem, assetsToken })
  const gemMinAmountOut = NormalizedUnitNumber(assetsAmount)
    .dividedBy(gemConversionFactor)
    .integerValue(BigNumber.ROUND_DOWN)
  return toBigInt(gemMinAmountOut)
}
