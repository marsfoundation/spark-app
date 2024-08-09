import { useSetUserEMode } from '@/domain/market-operations/useSetUserEMode'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { SetUserEModeAction } from './types'

export interface UseCreateSetUserEModeHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateSetUserEModeHandler(
  action: SetUserEModeAction,
  { enabled, onFinish }: UseCreateSetUserEModeHandlerOptions,
): ActionHandler {
  const setUserEMode = useSetUserEMode({
    categoryId: action.eModeCategoryId,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(setUserEMode),
    onAction: setUserEMode.write,
  }
}
