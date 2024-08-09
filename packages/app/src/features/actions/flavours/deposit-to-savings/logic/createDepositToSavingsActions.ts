import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { psmActionsConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { raise } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { DepositToSavingsAction, DepositToSavingsObjective } from '../types'
import { isDaiToSNstMigration, isSexyDaiDeposit, isUSDCToSDaiDeposit } from './common'

export function createDepositToSavingsActions(objective: DepositToSavingsObjective, context: ActionContext): Action[] {
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const chainId = context.chainId
  const depositAction: DepositToSavingsAction = {
    type: 'depositToSavings',
    value: objective.value,
    token: objective.token,
    savingsToken: objective.savingsToken,
  }

  if (isSexyDaiDeposit({ config: objective, tokensInfo, chainId })) {
    return [depositAction]
  }
  const spender = (() => {
    if (isUSDCToSDaiDeposit({ config: objective, tokensInfo })) {
      return getContractAddress(psmActionsConfig.address, chainId)
    }

    if (isDaiToSNstMigration({ config: objective, tokensInfo })) {
      return MIGRATE_ACTIONS_ADDRESS
    }

    return objective.savingsToken.address
  })()

  const approveAction: ApproveAction = {
    type: 'approve',
    token: objective.token,
    spender,
    value: objective.value,
  }

  return [approveAction, depositAction]
}
