import { useVaultDeposit } from '@/domain/tokenized-vault-operations/useVaultDeposit'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { DaiToSDaiDepositAction } from './types'

export interface UseCreateDaiToSDaiDepositHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateDaiToSDaiDepositHandler(
  action: DaiToSDaiDepositAction,
  options: UseCreateDaiToSDaiDepositHandlerOptions,
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
