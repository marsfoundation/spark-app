import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { psmActionsConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { isSexyDaiOperation, isUsdcPsmActionsOperation } from '@/features/actions/utils/savings'
import { raise } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { DepositToSavingsAction, DepositToSavingsObjective } from '../types'
import { isDaiToSNstMigration } from './common'

export function createDepositToSavingsActions(objective: DepositToSavingsObjective, context: ActionContext): Action[] {
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const chainId = context.chainId
  const depositAction: DepositToSavingsAction = {
    type: 'depositToSavings',
    value: objective.value,
    token: objective.token,
    savingsToken: objective.savingsToken,
  }
  const { token, savingsToken } = objective

  if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
    return [depositAction]
  }
  const spender = (() => {
    if (isUsdcPsmActionsOperation({ token, savingsToken, tokensInfo })) {
      return getContractAddress(psmActionsConfig.address, chainId)
    }

    if (isDaiToSNstMigration({ token, savingsToken, tokensInfo })) {
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
