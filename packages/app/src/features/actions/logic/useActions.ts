import { useActionsSettings } from '@/domain/state'
import { ActionHandler, BatchActionHandler, InjectedActionsContext, Objective } from './types'
import { useActionHandlers } from './useActionHandlers'
import { useActionsContext } from './useActionsContext'
import { useBatchActionHandler } from './useBatchActionHandler'
import { useCanWalletBatch } from './useCanWalletBatch'
import { useCreateActions } from './useCreateActions'

export interface UseActionsParams {
  objectives: Objective[]
  context?: InjectedActionsContext
  onFinish: () => void
  enabled: boolean
}

export interface UseActionsResult {
  batchActionHandler?: BatchActionHandler
  actionHandlers: ActionHandler[]
  settingsDisabled: boolean
}

export function useActions({
  objectives,
  context: injectedContext,
  onFinish,
  enabled,
}: UseActionsParams): UseActionsResult {
  const {
    data: { canWalletBatch },
  } = useCanWalletBatch()
  const actionsSettings = useActionsSettings()
  const context = useActionsContext(injectedContext)
  const actions = useCreateActions({
    objectives,
    actionsSettings,
    context,
    canWalletBatch,
  })

  const batchActionHandler = useBatchActionHandler({ actions, enabled: enabled && canWalletBatch, onFinish, context })
  const { actionHandlers, actionsInProgress } = useActionHandlers({
    actions,
    context,
    enabled: enabled && !canWalletBatch,
    onFinish,
  })

  return {
    actionHandlers,
    batchActionHandler: canWalletBatch ? batchActionHandler : undefined,
    settingsDisabled: canWalletBatch ? true : actionsInProgress,
  }
}
