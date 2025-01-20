import { useState } from 'react'
import { getFakePermitAction } from '../flavours/permit/logic/getFakePermitAction'
import { useCreatePermitHandler } from '../flavours/permit/logic/useCreatePermitHandler'
import { Action, ActionContext, ActionHandler } from './types'
import { useContractAction } from './useContractAction'

export interface UseActionHandlersParams {
  actions: Action[]
  onFinish: () => void
  enabled: boolean
  context: ActionContext
}

export interface UseActionHandlersResult {
  actionHandlers: ActionHandler[]
  actionsInProgress: boolean // @note: after first interaction, we don't enable for settings to change
}

export function useActionHandlers({
  actions,
  onFinish,
  enabled,
  context,
}: UseActionHandlersParams): UseActionHandlersResult {
  const [currentActionIndex, setCurrentActionIndex] = useState(0)
  const currentAction = actions[currentActionIndex]!

  const actionHandlers: ActionHandler[] = actions.map((action, index) => ({
    action,
    onAction: () => {},
    state: { status: index === currentActionIndex ? 'ready' : index < currentActionIndex ? 'success' : 'disabled' },
  }))

  const handler = useContractAction({
    action: currentAction,
    context,
    enabled: currentAction.type !== 'permit' && enabled,
  })

  const permitHandler = useCreatePermitHandler(
    currentAction.type === 'permit' ? currentAction : getFakePermitAction(),
    {
      enabled: enabled && currentAction.type === 'permit',
      permitStore: context.permitStore,
    },
  )

  const currentActionHandler = currentAction.type === 'permit' ? permitHandler : handler

  if (currentActionHandler?.state.status === 'success') {
    if (currentActionIndex === actions.length - 1) {
      onFinish?.()
    } else {
      setCurrentActionIndex(currentActionIndex + 1)
    }
  }

  if (currentActionHandler) {
    actionHandlers[currentActionIndex] = currentActionHandler
  }

  const actionsInProgress = currentActionIndex > 0

  return {
    actionHandlers,
    actionsInProgress,
  }
}
