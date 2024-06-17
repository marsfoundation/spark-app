import { useSexyDaiDeposit } from '@/domain/tokenized-vault-operations/useSexyDaiDeposit'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeXDaiDepositAction } from './types'

export interface UseCreateNativeXDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeXDaiDepositHandler(
  action: NativeXDaiDepositAction,
  options: UseCreateNativeXDaiDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useSexyDaiDeposit({
    value: action.xDai.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
