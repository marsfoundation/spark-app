import { useVaultWithdraw } from '@/domain/tokenized-vault-operations/useVaultWithdraw'

import { useVaultRedeem } from '@/domain/tokenized-vault-operations/useVaultRedeem'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { DaiFromSDaiWithdrawAction } from './types'

export interface UseCreateDaiFromSDaiWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateDaiFromSDaiWithdrawHandler(
  action: DaiFromSDaiWithdrawAction,
  options: UseCreateDaiFromSDaiWithdrawHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options
  const isWithdraw = action.method === 'withdraw'
  const isRedeem = action.method === 'redeem'

  const withdraw = useVaultWithdraw({
    vault: action.sDai.address,
    assetsAmount: isWithdraw ? action.dai.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isWithdraw,
    onTransactionSettled: onFinish,
  })
  const redeem = useVaultRedeem({
    vault: action.sDai.address,
    sharesAmount: isRedeem ? action.sDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    enabled: enabled && isRedeem,
    onTransactionSettled: onFinish,
  })

  const hookResult = isWithdraw ? withdraw : redeem

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
