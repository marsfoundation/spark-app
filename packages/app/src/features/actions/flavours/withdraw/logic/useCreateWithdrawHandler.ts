import { useWithdraw } from '@/domain/market-operations/useWithdraw'

import { ActionHandler } from '../../../logic/types'
import { mapWriteResultToActionState } from '../../../logic/utils'
import { WithdrawAction } from '../types'

export interface UseCreateWithdrawHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateWithdrawHandler(
  action: WithdrawAction,
  { enabled, onFinish }: UseCreateWithdrawHandlerOptions,
): ActionHandler {
  const withdraw = useWithdraw({
    asset: action.token.address,
    value: action.token.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(withdraw),
    onAction: withdraw.write,
  }
}
