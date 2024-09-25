import { useActionsSettings } from '@/domain/state'
import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { useMemo, useRef, useState } from 'react'
import { TransactionReceipt } from 'viem'
import { useChainId, useConfig } from 'wagmi'
import { getFakePermitAction } from '../flavours/permit/logic/getFakePermitAction'
import { useCreatePermitHandler } from '../flavours/permit/logic/useCreatePermitHandler'
import { createPermitStore } from './permits'
import { Action, ActionContext, ActionHandler, InjectedActionsContext, Objective } from './types'
import { useContractAction } from './useContractAction'
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
  const permitStore = useMemo(() => createPermitStore(), []) // useMemo not to call createPermitStore on every render
  const txReceipts = useRef<[Action, TransactionReceipt][]>([]).current
  const chainId = useChainId()
  const { account } = useConnectedAddress()
  const wagmiConfig = useConfig()
  const actionContext: ActionContext = {
    ...injectedContext,
    permitStore,
    txReceipts,
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

  const handler = useContractAction({
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
    handlers,
    settingsDisabled,
  }
}
