import { useVaultDeposit } from '@/domain/tokenized-vault-operations/useVaultDeposit'

import { PermitStore } from '../../logic/permits'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeSDaiDepositAction } from './types'

export interface UseCreateDepositHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
  onFinish?: () => void
}

export function useCreateNativeSDaiDepositHandler(
  action: NativeSDaiDepositAction,
  options: UseCreateDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useVaultDeposit({
    vault: action.sDai.address,
    assetsAmount: action.token.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
