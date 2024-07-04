import { useSexyDaiRedeem } from '@/domain/tokenized-vault-operations/useSexyDaiRedeem'
import { useSexyDaiWithdraw } from '@/domain/tokenized-vault-operations/useSexyDaiWithdraw'
import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { XDaiFromSDaiWithdrawAction } from './types'

export interface UseCreateXDaiFromSDaiWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateXDaiFromSDaiWithdrawHandler(
  action: XDaiFromSDaiWithdrawAction,
  options: UseCreateXDaiFromSDaiWithdrawHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options
  const isWithdraw = action.method === 'withdraw'
  const isRedeem = action.method === 'redeem'
  const isSend = action.mode === 'send'

  const withdraw = useSexyDaiWithdraw({
    assetsAmount: isWithdraw ? action.xDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    sDai: action.sDai.address,
    enabled: enabled && isWithdraw,
    onTransactionSettled: onFinish,
    mode: action.mode,
    ...(isSend ? { receiver: action.receiver, reserveAddresses: action.reserveAddresses } : {}),
  })
  const redeem = useSexyDaiRedeem({
    sharesAmount: isRedeem ? action.sDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    sDai: action.sDai.address,
    enabled: enabled && isRedeem,
    onTransactionSettled: onFinish,
    mode: action.mode,
    ...(isSend ? { receiver: action.receiver, reserveAddresses: action.reserveAddresses } : {}),
  })

  const hookResult = isWithdraw ? withdraw : redeem

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
