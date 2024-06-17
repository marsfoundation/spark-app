import { useVaultDeposit } from '@/domain/tokenized-vault-operations/useVaultDeposit'

import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeDaiDepositAction } from './types'

export interface UseCreateNativeDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeDaiDepositHandler(
  action: NativeDaiDepositAction,
  options: UseCreateNativeDaiDepositHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useVaultDeposit({
    vault: action.sDai.address,
    assetsAmount: action.dai.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
