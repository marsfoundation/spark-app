import { Token } from '@/domain/types/Token'
import { calculateGemConversionFactor } from '@/features/actions/utils/savings'
import { toBigInt } from '@/utils/bigNumber'
import { DepositToSavingsAction } from '../types'

interface GetMinAmountOutParams {
  action: DepositToSavingsAction
  token: Token
  savingsToken: Token
}

export function getAssetMinAmountOut({ action, token, savingsToken }: GetMinAmountOutParams): bigint {
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: token.decimals,
    assetsTokenDecimals: savingsToken.decimals,
  })
  const assetsMinAmountOut = toBigInt(token.toBaseUnit(action.value).multipliedBy(gemConversionFactor))

  return assetsMinAmountOut
}
