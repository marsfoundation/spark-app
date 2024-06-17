import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { psmActionsAddress, wethGatewayAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { BaseUnitNumber, NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import BigNumber from 'bignumber.js'
import { maxUint256 } from 'viem'
import { mainnet } from 'viem/chains'
import { ApproveDelegationAction } from '../flavours/approve-delegation/types'
import { ApproveExchangeAction } from '../flavours/approve-exchange/types'
import { ApproveAction } from '../flavours/approve/types'
import { BorrowAction } from '../flavours/borrow/types'
import { DepositAction } from '../flavours/deposit/types'
import { ExchangeAction } from '../flavours/exchange/types'
import { NativeDaiDepositAction } from '../flavours/native-dai-deposit/types'
import { NativeSDaiDepositAction } from '../flavours/native-sdai-deposit/types'
import { NativeSDaiWithdrawAction } from '../flavours/native-sdai-withdraw/types'
import { NativeUSDCDepositAction } from '../flavours/native-usdc-deposit/types'
import { NativeXDaiDepositAction } from '../flavours/native-xdai-deposit/types'
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
          const approveValue = objective.all
            ? NormalizedUnitNumber(objective.value.multipliedBy(1.01).toFixed(objective.reserve.token.decimals))
            : withdrawValue

          const approveAction: ApproveAction = {
            type: 'approve',
            token: objective.reserve.aToken,
            spender: wethGateway,
            value: approveValue,
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

      case 'exchange': {
        const exchangeAction: ExchangeAction = {
          type: 'exchange',
          value: objective.swapParams.value,
          swapParams: objective.swapParams,
          swapInfo: objective.swapInfo,
          formatAsDAIValue: objective.formatAsDAIValue,
        }

        if (objective.swapParams.fromToken.symbol === nativeAssetInfo.nativeAssetSymbol) {
          return [exchangeAction]
        }

        const approveExchangeAction: ApproveExchangeAction = {
          type: 'approveExchange',
          swapParams: objective.swapParams,
          swapInfo: objective.swapInfo,
        }

        return [approveExchangeAction, exchangeAction]
      }

      case 'nativeSDaiDeposit': {
        const spender =
          objective.token.symbol === TokenSymbol('USDC') ? psmActionsAddress[mainnet.id] : objective.sDai.address

        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.token,
          spender,
          value: objective.value,
          disallowPermit: true,
        }

        const depositAction: NativeSDaiDepositAction = {
          type: 'nativeSDaiDeposit',
          token: objective.token,
          value: objective.value,
          sDai: objective.sDai,
        }
        return [approveAction, depositAction]
      }

      case 'nativeSDaiWithdraw': {
        const withdrawAction: NativeSDaiWithdrawAction = {
          type: 'nativeSDaiWithdraw',
          token: objective.token,
          value: objective.value,
          sDai: objective.sDai,
          method: objective.method,
        }

        if (objective.token.symbol !== 'USDC') {
          return [withdrawAction]
        }

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

        return [approveAction, withdrawAction]
      }

      case 'nativeDaiDeposit': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.dai,
          spender: objective.sDai.address,
          value: objective.value,
        }

        const depositAction: NativeDaiDepositAction = {
          type: 'nativeDaiDeposit',
          value: objective.value,
          dai: objective.dai,
          sDai: objective.sDai,
        }

        return [approveAction, depositAction]
      }

      case 'nativeUSDCDeposit': {
        const approveAction: ApproveAction = {
          type: 'approve',
          token: objective.usdc,
          spender: psmActionsAddress[mainnet.id],
          value: objective.value,
          disallowPermit: true,
        }

        const depositAction: NativeUSDCDepositAction = {
          type: 'nativeUSDCDeposit',
          value: objective.value,
          usdc: objective.usdc,
          dai: objective.dai,
        }

        return [approveAction, depositAction]
      }

      case 'nativeXDaiDeposit': {
        const depositAction: NativeXDaiDepositAction = {
          type: 'nativeXDaiDeposit',
          value: objective.value,
        }

        return [depositAction]
      }
    }
  })
}
