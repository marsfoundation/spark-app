import { useVaultWithdraw } from '@/domain/tokenized-vault-operations/useVaultWithdraw'

import { useVaultRedeem } from '@/domain/tokenized-vault-operations/useVaultRedeem'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { NativeSDaiWithdrawAction } from './types'

export interface UseCreateNativeSDaiWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateNativeSDaiWithdrawHandler(
  action: NativeSDaiWithdrawAction,
  options: UseCreateNativeSDaiWithdrawHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const withdraw = useVaultWithdraw({
    vault: action.sDai.address,
    assetsAmount: action.token.toBaseUnit(action.value),
    enabled: enabled && action.method === 'withdraw',
    onTransactionSettled: onFinish,
  })
  const redeem = useVaultRedeem({
    vault: action.sDai.address,
    sharesAmount: action.sDai.toBaseUnit(action.value),
    enabled: enabled && action.method === 'redeem',
    onTransactionSettled: onFinish,
  })

  const hookResult = action.method === 'withdraw' ? withdraw : redeem

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
