import { MIGRATE_ACTIONS_ADDRESS } from '@/config/consts'
import { lendingPoolAddress, wethGatewayAddress } from '@/config/contracts-generated'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { ActionsSettings } from '@/domain/state/actions-settings'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { assert, raise } from '@/utils/assert'
import { maxUint256 } from 'viem'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction } from '../flavours/borrow/types'
import { ClaimRewardsAction } from '../flavours/claim-rewards/types'
import { createDepositToSavingsActions } from '../flavours/deposit-to-savings/logic/createDepositToSavingsActions'
import { DepositAction } from '../flavours/deposit/types'
import { DowngradeAction } from '../flavours/downgrade/types'
import { PermitAction } from '../flavours/permit/types'
import { RepayAction } from '../flavours/repay/types'
import { SetUseAsCollateralAction } from '../flavours/set-use-as-collateral/types'
import { SetUserEModeAction } from '../flavours/set-user-e-mode/logic/types'
import { StakeAction } from '../flavours/stake/types'
import { UpgradeAction } from '../flavours/upgrade/types'
import { createWithdrawFromSavingsActions } from '../flavours/withdraw-from-savings/logic/createWithdrawFromSavingsActions'
import { WithdrawFromSavingsObjective } from '../flavours/withdraw-from-savings/types'
import { WithdrawAction } from '../flavours/withdraw/types'
import { Action, ActionContext, Objective } from './types'

export interface UseCreateActionsParams {
  objectives: Objective[]
  actionsSettings: ActionsSettings
  actionContext: ActionContext
}

export function useCreateActions({ objectives, actionsSettings, actionContext }: UseCreateActionsParams): Action[] {
  const chainConfig = useChainConfigEntry()
  const nativeAssetInfo = chainConfig.nativeAssetInfo
  const wethGateway = useContractAddress(wethGatewayAddress)
  const lendingPool = useContractAddress(lendingPoolAddress)

  return objectives.flatMap((objective): Action[] => {
    // @note: you can create hooks (actions) conditionally, but ensure that component will be re-mounted when condition changes
    // to accomplish this, tweak stringifyObjectivesToStableActions function

    switch (objective.type) {
      case 'deposit': {
        const depositAction: DepositAction = {
          type: 'deposit',
          token: objective.token,
          value: objective.value,
        }

        if (objective.token.symbol === nativeAssetInfo.nativeAssetSymbol) {
          return [depositAction]
        }

        if (actionsSettings.preferPermits && chainConfig.permitSupport[objective.token.address]) {
          const permitAction: PermitAction = {
            type: 'permit',
            token: objective.token,
            spender: lendingPool,
            value: objective.value,
          }

          return [permitAction, depositAction]
        }

        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.token,
          spender: lendingPool,
          value: objective.value,
        }
        return [approveAction, depositAction]
      }

      case 'withdraw': {
        const withdrawValue = objective.all
          ? objective.reserve.token.fromBaseUnit(BaseUnitNumber(maxUint256))
          : objective.value

        if (objective.reserve.token.symbol === nativeAssetInfo.nativeAssetSymbol) {
          assert(objective.gatewayApprovalValue, 'gatewayApprovalValue is required for native asset')
          const approveAction: ApproveAction = {
            type: 'approve',
            token: objective.reserve.aToken,
            spender: wethGateway,
            value: objective.gatewayApprovalValue,
          }

          const withdrawAction: WithdrawAction = {
            type: 'withdraw',
            token: objective.reserve.token,
            value: withdrawValue,
          }
          return [approveAction, withdrawAction]
        }

        const withdrawAction: WithdrawAction = {
          type: 'withdraw',
          token: objective.reserve.token,
          value: withdrawValue,
        }
        return [withdrawAction]
      }

      case 'borrow': {
        if (objective.token.symbol === nativeAssetInfo.nativeAssetSymbol) {
          const approveDelegationAction: ApproveDelegationAction = {
            type: 'approveDelegation',
            token: objective.token,
            value: objective.value,
          }

          const borrowAction: BorrowAction = {
            type: 'borrow',
            token: objective.token,
            value: objective.value,
          }
          return [approveDelegationAction, borrowAction]
        }

        if (objective.token.symbol === chainConfig.USDSSymbol) {
          const marketInfo = actionContext.marketInfo ?? raise('Market info is required for borrow action')

          const borrowAction: BorrowAction = {
            type: 'borrow',
            token: marketInfo.DAI,
            value: objective.value,
          }
          const approveAction: ApproveAction = {
            type: 'approve',
            token: marketInfo.DAI,
            spender: MIGRATE_ACTIONS_ADDRESS,
            value: objective.value,
          }

          const upgradeAction: UpgradeAction = {
            type: 'upgrade',
            fromToken: marketInfo.DAI,
            toToken: objective.token,
            amount: objective.value,
          }

          return [borrowAction, approveAction, upgradeAction]
        }

        const borrowAction: BorrowAction = {
          type: 'borrow',
          token: objective.token,
          value: objective.value,
        }
        return [borrowAction]
      }

      case 'repay': {
        const repayAction: RepayAction = {
          type: 'repay',
          reserve: objective.reserve,
          value: objective.value,
          useAToken: objective.useAToken,
        }

        if (objective.reserve.token.symbol === nativeAssetInfo.nativeAssetSymbol || objective.useAToken) {
          return [repayAction]
        }

        if (actionsSettings.preferPermits && chainConfig.permitSupport[objective.reserve.token.address]) {
          const permitAction: PermitAction = {
            type: 'permit',
            token: objective.reserve.token,
            spender: lendingPool,
            value: objective.value,
          }

          return [permitAction, repayAction]
        }

        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.reserve.token,
          spender: lendingPool,
          requiredValue: objective.requiredApproval,
          value: objective.value,
        }
        return [approveAction, repayAction]
      }

      case 'setUseAsCollateral': {
        const setUseAsCollateralAction: SetUseAsCollateralAction = {
          type: 'setUseAsCollateral',
          token: objective.token,
          useAsCollateral: objective.useAsCollateral,
        }
        return [setUseAsCollateralAction]
      }

      case 'setUserEMode': {
        const setUserEModeAction: SetUserEModeAction = {
          type: 'setUserEMode',
          eModeCategoryId: objective.eModeCategoryId,
        }
        return [setUserEModeAction]
      }

      case 'claimRewards': {
        const claimRewardsActions: ClaimRewardsAction = {
          type: 'claimRewards',
          token: objective.token,
          incentiveControllerAddress: objective.incentiveControllerAddress,
          assets: objective.assets,
        }

        return [claimRewardsActions]
      }

      case 'upgrade': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.fromToken,
          spender: MIGRATE_ACTIONS_ADDRESS,
          value: objective.amount,
        }

        const upgradeAction: UpgradeAction = {
          type: 'upgrade',
          fromToken: objective.fromToken,
          toToken: objective.toToken,
          amount: objective.amount,
        }

        return [approveAction, upgradeAction]
      }

      case 'downgrade': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.fromToken,
          spender: MIGRATE_ACTIONS_ADDRESS,
          value: objective.amount,
        }

        const downgradeAction: DowngradeAction = {
          type: 'downgrade',
          fromToken: objective.fromToken,
          toToken: objective.toToken,
          amount: objective.amount,
        }

        return [approveAction, downgradeAction]
      }

      case 'withdrawFromSavings': {
        return createWithdrawFromSavingsActions(objective, actionContext)
      }

      case 'depositToSavings': {
        return createDepositToSavingsActions(objective, actionContext)
      }

      case 'stake': {
        const { farmsInfo } = actionContext
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

        if (stakingToken.symbol === chainConfig.USDSSymbol) {
          if (objective.token.symbol === chainConfig.daiSymbol) {
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

          if (objective.token.symbol === chainConfig.sDaiSymbol || objective.token.symbol === chainConfig.sUSDSSymbol) {
            const { savingsDaiInfo, savingsUsdsInfo } = actionContext
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
              objective.token.symbol === chainConfig.sDaiSymbol
                ? savingsDaiInfo.convertToAssets({ shares: objective.amount })
                : savingsUsdsInfo.convertToAssets({ shares: objective.amount })

            return [
              ...createWithdrawFromSavingsActions(withdrawObjective, actionContext),
              { ...approveStakeAction, value: stakeAmount },
              { ...stakeAction, stakeAmount },
            ]
          }
          // @todo: Add psm wrapper action flavor to support USDC staking
        }

        return [approveStakeAction, stakeAction]
      }
    }
  })
}
