import { useSwapAndDeposit } from '@/domain/psm-actions/useSwapAndDeposit'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { USDCToSDaiDepositAction } from './types'

export interface UseCreateUSDCToSDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateUSDCToSDaiDepositHandler(
  action: USDCToSDaiDepositAction,
  options: UseCreateUSDCToSDaiDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useSwapAndDeposit({
    assetsToken: action.sDai,
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
