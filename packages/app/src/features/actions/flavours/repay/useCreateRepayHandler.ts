import { useRepay } from '@/domain/market-operations/useRepay'

import { PermitStore } from '../../logic/permits'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { RepayAction } from './types'

export interface UseCreateRepayHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
  onFinish?: () => void
}

export function useCreateRepayHandler(action: RepayAction, options: UseCreateRepayHandlerOptions): ActionHandler {
  const { enabled, permitStore, onFinish } = options
  const permit = permitStore?.find(action.reserve.token)

  const repay = useRepay({
    asset: action.reserve.token.address,
    value: action.reserve.token.toBaseUnit(action.value),
    useAToken: action.useAToken,
    permit,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(repay),
    onAction: repay.write,
  }
}
