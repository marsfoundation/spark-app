import { useSexyDaiDeposit } from '@/domain/tokenized-vault-operations/useSexyDaiDeposit'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeXDaiDepositAction } from './types'

export interface UseCreateNativeSexyDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeSexyDaiDepositHandler(
  action: NativeXDaiDepositAction,
  options: UseCreateNativeSexyDaiDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useSexyDaiDeposit({
    value: action.value,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
