import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { psmActionsAddress, savingsXDaiAdapterAddress, wethGatewayAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import BigNumber from 'bignumber.js'
import { maxUint256 } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction } from '../flavours/borrow/types'
import { ClaimRewardsAction } from '../flavours/claim-rewards/types'
import { DepositAction } from '../flavours/deposit/types'
import { DaiToSDaiDepositAction } from '../flavours/native-sdai-deposit/dai-to-sdai/types'
import { USDCToSDaiDepositAction } from '../flavours/native-sdai-deposit/usdc-to-sdai/types'
import { XDaiToSDaiDepositAction } from '../flavours/native-sdai-deposit/xdai-to-sdai/types'
import { DaiFromSDaiWithdrawAction } from '../flavours/native-sdai-withdraw/dai-from-sdai/types'
import { USDCFromSDaiWithdrawAction } from '../flavours/native-sdai-withdraw/usdc-from-sdai/types'
import { XDaiFromSDaiWithdrawAction } from '../flavours/native-sdai-withdraw/xdai-from-sdai/types'
import { RepayAction } from '../flavours/repay/types'
import { SetUseAsCollateralAction } from '../flavours/set-use-as-collateral/types'
import { SetUserEModeAction } from '../flavours/set-user-e-mode/types'
import { WithdrawAction } from '../flavours/withdraw/types'
import { Action, Objective } from './types'

export function useCreateActions(objectives: Objective[]): Action[] {
  const chainId = useOriginChainId()
  const nativeAssetInfo = getNativeAssetInfo(chainId)
  const wethGateway = useContractAddress(wethGatewayAddress)

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
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.token,
          spender: objective.lendingPool,
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
            debtTokenAddress: objective.debtTokenAddress,
            delegatee: wethGateway,
            value: objective.value,
          }

          const borrowAction: BorrowAction = {
            type: 'borrow',
            token: objective.token,
            value: objective.value,
          }
          return [approveDelegationAction, borrowAction]
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
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.reserve.token,
          spender: objective.lendingPool,
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

      case 'daiFromSDaiWithdraw': {
        const isSend = objective.mode === 'send'
        const withdrawAction: DaiFromSDaiWithdrawAction = {
          type: 'daiFromSDaiWithdraw',
          dai: objective.dai,
          sDai: objective.sDai,
          value: objective.value,
          method: objective.method,
          mode: objective.mode,
          ...(isSend ? { receiver: objective.receiver, reserveAddresses: objective.reserveAddresses } : {}),
        }

        return [withdrawAction]
      }

      case 'usdcFromSDaiWithdraw': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.sDai,
          spender: psmActionsAddress[mainnet.id],
          value:
            objective.method === 'withdraw'
              ? NormalizedUnitNumber(objective.sDaiValueEstimate.toFixed(objective.sDai.decimals, BigNumber.ROUND_UP))
              : objective.value,
          disallowPermit: true,
        }

        const isSend = objective.mode === 'send'
        const withdrawAction: USDCFromSDaiWithdrawAction = {
          type: 'usdcFromSDaiWithdraw',
          usdc: objective.usdc,
          sDai: objective.sDai,
          value: objective.value,
          method: objective.method,
          mode: objective.mode,
          ...(isSend ? { receiver: objective.receiver, reserveAddresses: objective.reserveAddresses } : {}),
        }

        return [approveAction, withdrawAction]
      }

      case 'xDaiFromSDaiWithdraw': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.sDai,
          spender: savingsXDaiAdapterAddress[gnosis.id],
          value:
            objective.method === 'withdraw'
              ? NormalizedUnitNumber(objective.sDaiValueEstimate.toFixed(objective.sDai.decimals, BigNumber.ROUND_UP))
              : objective.value,
        }

        const isSend = objective.mode === 'send'
        const withdrawAction: XDaiFromSDaiWithdrawAction = {
          type: 'xDaiFromSDaiWithdraw',
          xDai: objective.xDai,
          sDai: objective.sDai,
          value: objective.value,
          method: objective.method,
          mode: objective.mode,
          ...(isSend ? { receiver: objective.receiver, reserveAddresses: objective.reserveAddresses } : {}),
        }

        return [approveAction, withdrawAction]
      }

      case 'daiToSDaiDeposit': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.dai,
          spender: objective.sDai.address,
          value: objective.value,
        }

        const depositAction: DaiToSDaiDepositAction = {
          type: 'daiToSDaiDeposit',
          value: objective.value,
          dai: objective.dai,
          sDai: objective.sDai,
        }

        return [approveAction, depositAction]
      }

      case 'usdcToSDaiDeposit': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.usdc,
          spender: psmActionsAddress[mainnet.id],
          value: objective.value,
          disallowPermit: true,
        }

        const depositAction: USDCToSDaiDepositAction = {
          type: 'usdcToSDaiDeposit',
          value: objective.value,
          usdc: objective.usdc,
          sDai: objective.sDai,
        }

        return [approveAction, depositAction]
      }

      case 'xDaiToSDaiDeposit': {
        const depositAction: XDaiToSDaiDepositAction = {
          type: 'xDaiToSDaiDeposit',
          value: objective.value,
          xDai: objective.xDai,
          sDai: objective.sDai,
        }

        return [depositAction]
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
    }
  })
}
