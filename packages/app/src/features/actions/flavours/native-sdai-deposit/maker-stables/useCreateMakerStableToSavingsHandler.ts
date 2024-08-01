import { useVaultDeposit } from '@/domain/tokenized-vault-operations/useVaultDeposit'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { MakerStableToSavingsAction } from './types'

export interface UseCreateMakerStableToSavingsHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateMakerStableToSavingsHandler(
  action: MakerStableToSavingsAction,
  options: UseCreateMakerStableToSavingsHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const deposit = useVaultDeposit({
    vault: action.savingsToken.address,
    assetsAmount: action.stableToken.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
