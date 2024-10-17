import { basePsm3Address } from '@/config/abis/basePsm3Abi'
import { migrationActionsConfig, psmActionsConfig, usdsPsmActionsConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { raise } from '@/utils/assert'
import { assertNever } from '@/utils/assertNever'
import { ApproveAction } from '../../approve/types'
import { DepositToSavingsAction, DepositToSavingsObjective } from '../types'
import { getSavingsDepositActionPath } from './getSavingsDepositActionPath'

export function createDepositToSavingsActions(objective: DepositToSavingsObjective, context: ActionContext): Action[] {
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const chainId = context.chainId

  const depositAction: DepositToSavingsAction = {
    type: 'depositToSavings',
    value: objective.value,
    token: objective.token,
    savingsToken: objective.savingsToken,
  }
  function getApproveAction(spender: CheckedAddress): ApproveAction {
    return {
      type: 'approve',
      token: objective.token,
      spender,
      value: objective.value,
    }
  }

  const actionPath = getSavingsDepositActionPath({
    token: objective.token,
    savingsToken: objective.savingsToken,
    tokensInfo,
    chainId,
  })

  switch (actionPath) {
    case 'sexy-dai-to-sdai':
      return [depositAction]

    case 'usdc-to-sdai':
      return [getApproveAction(getContractAddress(psmActionsConfig.address, chainId)), depositAction]

    case 'usdc-to-susds':
      return [getApproveAction(getContractAddress(usdsPsmActionsConfig.address, chainId)), depositAction]

    case 'dai-to-susds':
      return [getApproveAction(getContractAddress(migrationActionsConfig.address, chainId)), depositAction]

    case 'dai-to-sdai':
    case 'usds-to-susds':
      return [getApproveAction(objective.savingsToken.address), depositAction]

    case 'base-usdc-to-susds':
    case 'base-usds-to-susds':
      return [getApproveAction(getContractAddress(basePsm3Address, chainId)), depositAction]

    default:
      assertNever(actionPath)
  }
}
