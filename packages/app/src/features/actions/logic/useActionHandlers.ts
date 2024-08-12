import { useActionsSettings } from '@/domain/state'
import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { useMemo, useState } from 'react'
import { useChainId, useConfig } from 'wagmi'
import { getFakePermitAction } from '../flavours/permit/logic/getFakePermitAction'
import { useCreatePermitHandler } from '../flavours/permit/logic/useCreatePermitHandler'
import { createPermitStore } from './permits'
import { ActionContext, ActionHandler, InjectedActionsContext, Objective } from './types'
import { useAction } from './useAction'
import { useCreateActions } from './useCreateActions'

export interface UseActionHandlersOptions {
  onFinish?: () => void
  enabled: boolean
  context?: InjectedActionsContext
}

export interface UseActionHandlersResult {
  handlers: ActionHandler[]
  settingsDisabled: boolean // @note: after first interaction, we don't enable for settings to change
}

export function useActionHandlers(
  objectives: Objective[],
  { onFinish, enabled, context: injectedContext }: UseActionHandlersOptions,
): UseActionHandlersResult {
  const actionsSettings = useActionsSettings()
  const permitStore = useMemo(() => createPermitStore(), [])
  const chainId = useChainId()
  const { account } = useConnectedAddress()
  const wagmiConfig = useConfig()
  const actionContext: ActionContext = {
    ...injectedContext,
    permitStore,
    wagmiConfig,
    account,
    chainId,
  }
  const actions = useCreateActions({
    objectives,
    actionsSettings,
    actionContext,
  })

  const [currentActionIndex, setCurrentActionIndex] = useState(0)
  const currentAction = actions[currentActionIndex]!

  const handlers: ActionHandler[] = actions.map((action, index) => ({
    action,
    onAction: () => {},
    state: { status: index === currentActionIndex ? 'ready' : index < currentActionIndex ? 'success' : 'disabled' },
  }))

  const handler = useAction({
    action: currentAction,
    context: actionContext,
    enabled: currentAction.type !== 'permit' && enabled,
  })

  const permitHandler = useCreatePermitHandler(
    currentAction.type === 'permit' ? currentAction : getFakePermitAction(),
    {
      enabled: enabled && currentAction.type === 'permit',
      permitStore,
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
    handlers[currentActionIndex] = currentActionHandler
  }

  const settingsDisabled = currentActionIndex > 0

  return {
    handlers: handlers,
    settingsDisabled,
  }
}
