import { getChainConfigEntry } from '@/config/chain'
import { migrationActionsConfig, usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert, raise } from '@/utils/assert'
import { ApproveAction } from '../../approve/types'
import { DowngradeAction } from '../../downgrade/types'
import { UsdsPsmConvertAction } from '../../usds-psm-convert/types'
import { UnstakeAction, UnstakeObjective } from '../types'

export function createUnstakeActions(objective: UnstakeObjective, context: ActionContext): Action[] {
  const { farmsInfo, chainId } = context
  const { daiSymbol, USDSSymbol } = getChainConfigEntry(chainId)

  assert(farmsInfo, 'Farms info is required for stake action')
  const { stakingToken, rewardToken } = farmsInfo.findOneFarmByAddress(objective.farm).blockchainInfo

  const unstakeAction: UnstakeAction = {
    type: 'unstake',
    farm: objective.farm,
    stakingToken,
    rewardToken,
    exit: objective.exit,
    amount: objective.amount,
  }

  if (stakingToken.symbol === USDSSymbol) {
    if (objective.token.symbol === daiSymbol) {
      const approveDowngradeAction: ApproveAction = {
        type: 'approve',
        token: stakingToken,
        spender: getContractAddress(migrationActionsConfig.address, chainId),
        value: objective.amount,
      }

      const downgradeAction: DowngradeAction = {
        type: 'downgrade',
        fromToken: stakingToken,
        toToken: objective.token,
        amount: objective.amount,
      }

      return [unstakeAction, approveDowngradeAction, downgradeAction]
    }

    assert(context.tokensInfo, 'Tokens info is required for unstake action')
    const usdc = context.tokensInfo.findOneTokenBySymbol(TokenSymbol('USDC'))
    if (objective.token.symbol === usdc.symbol) {
      const approveConvertAction: ApproveAction = {
        type: 'approve',
        token: stakingToken,
        spender: getContractAddress(usdsPsmWrapperConfig.address, chainId),
        value: objective.amount,
      }

      const convertToUsdcAction: UsdsPsmConvertAction = {
        type: 'usdsPsmConvert',
        inToken: context.tokensInfo.USDS ?? raise('USDS token is required for usds psm convert action'),
        outToken: objective.token,
        amount: objective.amount,
      }

      return [unstakeAction, approveConvertAction, convertToUsdcAction]
    }
  }

  return [unstakeAction]
}
