import { useSexyDaiDeposit } from '@/domain/tokenized-vault-operations/useSexyDaiDeposit'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { XDaiToSDaiDepositAction } from './types'

export interface UseCreateXDaiToSDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateXDaiToSDaiDepositHandler(
  action: XDaiToSDaiDepositAction,
  options: UseCreateXDaiToSDaiDepositHandlerOptions,
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
