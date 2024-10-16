import { dssPsmLiteConfig, migrationActionsConfig, usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert, raise } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { ConvertStablesObjective } from '../types'

export function createConvertStablesActions(objective: ConvertStablesObjective, context: ActionContext): Action[] {
  const { chainId, tokensInfo } = context
  assert(tokensInfo, 'Tokens info is required for convert stables objective')

  const actionPath = getConvertStablesActionPath({
    inToken: objective.inToken,
    outToken: objective.outToken,
    tokensInfo,
  })

  function getApproveAction(spender: CheckedAddress): ApproveAction {
    return {
      type: 'approve',
      token: objective.inToken,
      spender,
      value: objective.amount,
    }
  }

  switch (actionPath) {
    case 'dai-usdc':
    case 'usdc-dai':
      return [
        getApproveAction(getContractAddress(dssPsmLiteConfig.address, chainId)),
        {
          type: 'daiPsmConvert',
          inToken: objective.inToken,
          outToken: objective.outToken,
          amount: objective.amount,
        },
      ]
    case 'usdc-usds':
    case 'usds-usdc':
      return [
        getApproveAction(getContractAddress(usdsPsmWrapperConfig.address, chainId)),
        {
          type: 'usdsPsmConvert',
          inToken: objective.inToken,
          outToken: objective.outToken,
          amount: objective.amount,
        },
      ]
    case 'dai-usds':
      return [
        getApproveAction(getContractAddress(migrationActionsConfig.address, chainId)),
        {
          type: 'upgrade',
          fromToken: objective.inToken,
          toToken: objective.outToken,
          amount: objective.amount,
        },
      ]
    case 'usds-dai':
      return [
        getApproveAction(getContractAddress(migrationActionsConfig.address, chainId)),
        {
          type: 'downgrade',
          fromToken: objective.inToken,
          toToken: objective.outToken,
          amount: objective.amount,
        },
      ]
  }
}

export type ConvertStablesActionPath = 'dai-usdc' | 'usdc-dai' | 'usdc-usds' | 'usds-usdc' | 'dai-usds' | 'usds-dai'

function getConvertStablesActionPath({
  inToken,
  outToken,
  tokensInfo,
}: { inToken: Token; outToken: Token; tokensInfo: TokensInfo }): ConvertStablesActionPath {
  const dai = tokensInfo.DAI?.symbol
  const usdc = TokenSymbol('USDC')
  const usds = tokensInfo.USDS?.symbol

  if (inToken.symbol === dai && outToken.symbol === usdc) {
    return 'dai-usdc'
  }

  if (inToken.symbol === usdc && outToken.symbol === dai) {
    return 'usdc-dai'
  }

  if (inToken.symbol === dai && outToken.symbol === usds) {
    return 'dai-usds'
  }

  if (inToken.symbol === usds && outToken.symbol === dai) {
    return 'usds-dai'
  }

  if (inToken.symbol === usdc && outToken.symbol === usds) {
    return 'usdc-usds'
  }

  if (inToken.symbol === usds && outToken.symbol === usdc) {
    return 'usds-usdc'
  }

  raise('Convert stables action type not recognized')
}
