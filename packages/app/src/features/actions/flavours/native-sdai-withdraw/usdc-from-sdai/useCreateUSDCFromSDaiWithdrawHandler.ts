import { useRedeemAndSwap } from '@/domain/psm-actions/redeem-and-swap/useRedeemAndSwap'
import { useWithdrawAndSwap } from '@/domain/psm-actions/useWithdrawAndSwap'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { USDCFromSDaiWithdrawAction } from './types'

export interface UseCreateUSDCFromSDaiWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateUSDCFromSDaiWithdrawHandler(
  action: USDCFromSDaiWithdrawAction,
  options: UseCreateUSDCFromSDaiWithdrawHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options
  const isWithdraw = action.method === 'withdraw'
  const isRedeem = action.method === 'redeem'

  const withdraw = useWithdrawAndSwap({
    assetsToken: action.sDai,
    gem: action.usdc,
    gemAmountOut: isWithdraw ? action.usdc.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isWithdraw,
    onTransactionSettled: onFinish,
  })
  const redeem = useRedeemAndSwap({
    assetsToken: action.sDai,
    gem: action.usdc,
    sharesAmount: isRedeem ? action.sDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isRedeem,
    onTransactionSettled: onFinish,
  })

  const hookResult = isWithdraw ? withdraw : redeem

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
