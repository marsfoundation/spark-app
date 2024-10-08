import { getChainConfigEntry } from '@/config/chain'
import { migrationActionsConfig, usdsPsmWrapperConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { Action, ActionContext } from '@/features/actions/logic/types'
import { assert, raise } from '@/utils/assert'
import { TransactionReceipt, decodeEventLog, erc4626Abi } from 'viem'
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
  const { stakingToken, rewardToken } = farmsInfo.findOneFarmByAddress(objective.farm).blockchainInfo

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
      const withdrawObjective: WithdrawFromSavingsObjective = {
        type: 'withdrawFromSavings',
        token: stakingToken,
        savingsToken: objective.token,
        amount: objective.amount,
        isRedeem: true,
        mode: 'withdraw',
      }

      const [, withdrawReceipt] = context.txReceipts.find(([action]) => action.type === 'withdrawFromSavings') ?? []
      const stakeAmount = withdrawReceipt
        ? getStakeAmountFromWithdrawReceipt(objective.token, withdrawReceipt)
        : NormalizedUnitNumber(0)

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

function getStakeAmountFromWithdrawReceipt(token: Token, receipt: TransactionReceipt): NormalizedUnitNumber {
  for (const log of receipt.logs) {
    try {
      const decodedLog = decodeEventLog({
        abi: erc4626Abi,
        data: log.data,
        topics: log.topics,
      })
      if (decodedLog.eventName === 'Withdraw') {
        return token.fromBaseUnit(BaseUnitNumber(decodedLog.args.assets))
      }
    } catch {
      // ignore error - there may be some other events we are not able to parse
    }
  }
  throw new Error('Withdraw receipt does not contain withdraw event')
}
