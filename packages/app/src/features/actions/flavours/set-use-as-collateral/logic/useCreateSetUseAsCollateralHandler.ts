import { useSetUseAsCollateral } from '@/domain/market-operations/useSetUseAsCollateral'

import { ActionHandler } from '../../../logic/types'
import { mapWriteResultToActionState } from '../../../logic/utils'
import { SetUseAsCollateralAction } from '../types'

export interface UseCreateSetUseAsCollateralHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateSetUseAsCollateralHandler(
  action: SetUseAsCollateralAction,
  { enabled, onFinish }: UseCreateSetUseAsCollateralHandlerOptions,
): ActionHandler {
  const setUseAsCollateral = useSetUseAsCollateral({
    asset: action.token.address,
    useAsCollateral: action.useAsCollateral,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(setUseAsCollateral),
    onAction: setUseAsCollateral.write,
  }
}
