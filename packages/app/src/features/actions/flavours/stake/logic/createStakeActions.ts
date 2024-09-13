import { getChainConfigEntry } from '@/config/chain'
import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { UpgradeAction } from '../../upgrade/types'
import { createWithdrawFromSavingsActions } from '../../withdraw-from-savings/logic/createWithdrawFromSavingsActions'
import { WithdrawFromSavingsObjective } from '../../withdraw-from-savings/types'
import { StakeAction, StakeObjective } from '../types'

export function createStakeActions(objective: StakeObjective, context: ActionContext): Action[] {
  const { farmsInfo, chainId } = context
  const { sDaiSymbol, sUSDSSymbol, daiSymbol, USDSSymbol } = getChainConfigEntry(chainId)

  assert(farmsInfo, 'Farms info is required for stake action')
  const { stakingToken, rewardToken } = farmsInfo.findOneFarmByAddress(objective.farm)

  const approveStakeAction: ApproveAction = {
    type: 'approve',
    token: stakingToken,
    spender: objective.farm,
    value: objective.amount,
  }

  const stakeAction: StakeAction = {
    type: 'stake',
    farm: objective.farm,
    stakeAmount: objective.amount,
    rewardToken,
    stakingToken,
  }

  if (stakingToken.symbol === USDSSymbol) {
    if (objective.token.symbol === daiSymbol) {
      const approveMigrateAction: ApproveAction = {
        type: 'approve',
        token: objective.token,
        spender: MIGRATE_ACTIONS_ADDRESS,
        value: objective.amount,
      }

      const upgradeAction: UpgradeAction = {
        type: 'upgrade',
        fromToken: objective.token,
        toToken: stakingToken,
        amount: objective.amount,
      }

      return [approveMigrateAction, upgradeAction, approveStakeAction, stakeAction]
    }

    if (objective.token.symbol === sDaiSymbol || objective.token.symbol === sUSDSSymbol) {
      const { savingsDaiInfo, savingsUsdsInfo } = context
      assert(savingsDaiInfo && savingsUsdsInfo, 'Savings info is required when input for stake is savings token')

      const withdrawObjective: WithdrawFromSavingsObjective = {
        type: 'withdrawFromSavings',
        token: stakingToken,
        savingsToken: objective.token,
        amount: objective.amount,
        isRedeem: true,
        mode: 'withdraw',
      }

      const stakeAmount =
        objective.token.symbol === sDaiSymbol
          ? savingsDaiInfo.convertToAssets({ shares: objective.amount })
          : savingsUsdsInfo.convertToAssets({ shares: objective.amount })

      return [
        ...createWithdrawFromSavingsActions(withdrawObjective, context),
        { ...approveStakeAction, value: stakeAmount },
        { ...stakeAction, stakeAmount },
      ]
    }

    // @todo: Add psm swap action flavor to support USDC staking
  }

  return [approveStakeAction, stakeAction]
}