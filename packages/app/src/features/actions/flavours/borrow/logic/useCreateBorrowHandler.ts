import { useBorrow } from '@/domain/market-operations/useBorrow'

import { ActionHandler } from '../../../logic/types'
import { mapWriteResultToActionState } from '../../../logic/utils'
import { BorrowAction } from '../types'

export interface UseCreateBorrowActionHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateBorrowActionHandler(
  action: BorrowAction,
  { enabled, onFinish }: UseCreateBorrowActionHandlerOptions,
): ActionHandler {
  const borrow = useBorrow({
    asset: action.token.address,
    value: action.token.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(borrow),
    onAction: borrow.write,
  }
}
