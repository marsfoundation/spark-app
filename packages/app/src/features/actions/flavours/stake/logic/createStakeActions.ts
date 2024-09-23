import { getChainConfigEntry } from '@/config/chain'
import { migrationActionsConfig, usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert, raise } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { UpgradeAction } from '../../upgrade/types'
import { UsdsPsmConvertAction } from '../../usds-psm-convert/types'
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
      const approveUpgradeAction: ApproveAction = {
        type: 'approve',
        token: objective.token,
        spender: getContractAddress(migrationActionsConfig.address, chainId),
        value: objective.amount,
      }

      const upgradeAction: UpgradeAction = {
        type: 'upgrade',
        fromToken: objective.token,
        toToken: stakingToken,
        amount: objective.amount,
      }

      return [approveUpgradeAction, upgradeAction, approveStakeAction, stakeAction]
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

    assert(context.tokensInfo, 'Tokens info is required for stake action')
    const usdc = context.tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))

    if (objective.token.symbol === usdc.symbol) {
      const approveConvertAction: ApproveAction = {
        type: 'approve',
        token: objective.token,
        spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        value: objective.amount,
      }

      const convertToUsdsAction: UsdsPsmConvertAction = {
        type: 'usdsPsmConvert',
        inToken: objective.token,
        outToken: context.tokensInfo.USDS ?? raise('USDS token is required for usds psm convert action'),
        amount: objective.amount,
      }

      return [approveConvertAction, convertToUsdsAction, approveStakeAction, stakeAction]
    }
  }

  return [approveStakeAction, stakeAction]
}
