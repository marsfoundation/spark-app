import { useSwapAndDeposit } from '@/domain/psm-actions/useSwapAndDeposit'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeUSDCDepositAction } from './types'

export interface UseCreateNativeUSDCDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeUSDCDepositHandler(
  action: NativeUSDCDepositAction,
  options: UseCreateNativeUSDCDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useSwapAndDeposit({
    assetsToken: action.dai,
    gem: action.usdc,
    gemAmount: action.usdc.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
