import { useSexyDaiRedeemAll } from '@/domain/tokenized-vault-operations/useSexyDaiRedeemAll'
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
  const isRedeemAll = action.method === 'redeem-all'

  const withdraw = useSexyDaiWithdraw({
    assetsAmount: isWithdraw ? action.xDai.toBaseUnit(action.value) : BaseUnitNumber(0),
    sDai: action.sDai.address,
    enabled: enabled && isWithdraw,
    onTransactionSettled: onFinish,
  })
  const redeemAll = useSexyDaiRedeemAll({
    sDai: action.sDai.address,
    enabled: enabled && isRedeemAll,
    onTransactionSettled: onFinish,
  })

  const hookResult = isWithdraw ? withdraw : redeemAll

  return {
    action,
    state: mapWriteResultToActionState(hookResult),
    onAction: hookResult.write,
  }
}
