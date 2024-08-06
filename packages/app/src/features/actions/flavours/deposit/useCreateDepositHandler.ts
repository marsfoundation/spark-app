import { useSupply } from '@/domain/market-operations/useSupply'
import { PermitStore } from '../../logic/permits'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { DepositAction } from './types'

export interface UseCreateDepositHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
  onFinish?: () => void
}

export function useCreateDepositHandler(action: DepositAction, options: UseCreateDepositHandlerOptions): ActionHandler {
  const { enabled, permitStore, onFinish } = options
  const permit = permitStore?.find(action.token)

  const deposit = useSupply({
    asset: action.token.address,
    value: action.token.toBaseUnit(action.value),
    permit,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(deposit),
    onAction: deposit.write,
  }
}
