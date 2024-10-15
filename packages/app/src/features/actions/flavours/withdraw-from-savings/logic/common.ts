import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { calculateGemConversionFactor } from '@/features/actions/utils/savings'
import { toBigInt } from '@/utils/bigNumber'
import { WithdrawFromSavingsAction } from '../types'
import { calculateGemMinAmountOut } from './calculateGemMinAmountOut'

interface GetMaxAmountInParams {
  action: WithdrawFromSavingsAction
  token: Token
  savingsToken: Token
}

export function getAssetMaxAmountIn({ action, token, savingsToken }: GetMaxAmountInParams): bigint {
  const gemConversionFactor = calculateGemConversionFactor({
    gemDecimals: token.decimals,
    assetsTokenDecimals: savingsToken.decimals,
  })
  const assetsMaxAmountIn = toBigInt(token.toBaseUnit(action.amount).multipliedBy(gemConversionFactor))

  return assetsMaxAmountIn
}

type GetGemMinAmountOutParams = {
  action: WithdrawFromSavingsAction
  token: Token
  savingsToken: Token
  savingsInfo: SavingsInfo
}

export function getGemMinAmountOut({ action, token, savingsToken, savingsInfo }: GetGemMinAmountOutParams): bigint {
  const assetsAmount = savingsInfo.convertToAssets({ shares: action.amount })

  const gemMinAmountOut = calculateGemMinAmountOut({
    gemDecimals: token.decimals,
    assetsTokenDecimals: savingsToken.decimals,
    assetsAmount: toBigInt(savingsToken.toBaseUnit(assetsAmount)),
  })

  return gemMinAmountOut
}
