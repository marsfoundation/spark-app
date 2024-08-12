import { psmActionsAddress, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { isSexyDaiOperation, isUsdcPsmActionsOperation, isVaultOperation } from '@/features/actions/utils/savings'
import { assert, raise } from '@/utils/assert'
import BigNumber from 'bignumber.js'
import { gnosis, mainnet } from 'viem/chains'
import { ApproveAction } from '../../approve/types'
import { WithdrawFromSavingsAction, WithdrawFromSavingsObjective } from '../types'

export function createWithdrawFromSavingsActions(
  objective: WithdrawFromSavingsObjective,
  context: ActionContext,
): Action[] {
  const tokensInfo = context.tokensInfo ?? raise('Tokens info is required for deposit to savings action')
  const chainId = context.chainId
  const { token, savingsToken } = objective

  const withdrawAction: WithdrawFromSavingsAction = {
    type: 'withdrawFromSavings',
    amount: objective.amount,
    token: objective.token,
    savingsToken: objective.savingsToken,
    isMax: objective.isMax,
    mode: objective.mode,
    receiver: objective.mode === 'send' ? objective.receiver : undefined,
  }

  if (isVaultOperation({ token, savingsToken, tokensInfo, chainId })) {
    return [withdrawAction]
  }

  assert(context.savingsDaiInfo, 'Savings info is required for withdraw from savings action approval')
  const sDaiValueEstimate = context.savingsDaiInfo.convertToAssets({ shares: objective.amount })

  const spender = (() => {
    if (isUsdcPsmActionsOperation({ token, savingsToken, tokensInfo })) {
      return psmActionsAddress[mainnet.id]
    }

    if (isSexyDaiOperation({ token, savingsToken, tokensInfo, chainId })) {
      return savingsXDaiAdapterAddress[gnosis.id]
    }

    return objective.savingsToken.address
  })()

  const approveAction: ApproveAction = {
    type: 'approve',
    token: savingsToken,
    spender,
    value: objective.isMax
      ? objective.amount
      : NormalizedUnitNumber(sDaiValueEstimate.toFixed(objective.savingsToken.decimals, BigNumber.ROUND_UP)),
  }

  return [approveAction, withdrawAction]
}
