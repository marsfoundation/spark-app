import {
  basePsm3Address,
  dssLitePsmConfig,
  migrationActionsConfig,
  usdsPsmWrapperConfig,
} from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert, CheckedAddress, assertNever } from '@marsfoundation/common-universal'
import { base } from 'viem/chains'
import { ApproveAction } from '../../approve/types'
import { ConvertStablesObjective } from '../types'
import { getConvertStablesActionPath } from './getConvertStablesActionPath'

export function createConvertStablesActions(objective: ConvertStablesObjective, context: ActionContext): Action[] {
  const { chainId, tokensInfo } = context
  assert(tokensInfo, 'Tokens info is required for convert stables objective')

  const actionPath = getConvertStablesActionPath({
    inToken: objective.inToken,
    outToken: objective.outToken,
    tokensInfo,
    chainId,
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
        getApproveAction(getContractAddress(dssLitePsmConfig.address, chainId)),
        createPsmConvertAction(objective),
      ]

    case 'usdc-usds':
    case 'usds-usdc':
      return [
        getApproveAction(getContractAddress(usdsPsmWrapperConfig.address, chainId)),
        createPsmConvertAction(objective),
      ]

    case 'base-usdc-usds':
    case 'base-usds-usdc':
      return [getApproveAction(CheckedAddress(basePsm3Address[base.id])), createPsmConvertAction(objective)]

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

    default:
      assertNever(actionPath)
  }
}

function createPsmConvertAction(objective: ConvertStablesObjective): Action {
  return {
    type: 'psmConvert',
    inToken: objective.inToken,
    outToken: objective.outToken,
    amount: objective.amount,
  }
}
