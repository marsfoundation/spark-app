import { useMigrateDAIToSNST } from '@/domain/migration-actions/useMigrateDAIToSNST'
import { ActionHandler } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { MigrateDAIToSNSTAction } from './types'

export interface UseCreateMigrateDAIToSNSTHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateMigrateDAIToSNSTHandler(
  action: MigrateDAIToSNSTAction,
  options: UseCreateMigrateDAIToSNSTHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const migrate = useMigrateDAIToSNST({
    dai: action.stableToken.address,
    daiAmount: action.stableToken.toBaseUnit(action.value),
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(migrate),
    onAction: migrate.write,
  }
}
