import { useActionsSettings } from '@/domain/state'
import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { useOnDepsChange } from '@/utils/useOnDepsChange'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import { ContractFunctionParameters, TransactionReceipt } from 'viem'
import { useChainId, useConfig } from 'wagmi'
import { UseWriteContractsReturnType, useCallsStatus, useCapabilities, useWriteContracts } from 'wagmi/experimental'
import { getFakePermitAction } from '../flavours/permit/logic/getFakePermitAction'
import { useCreatePermitHandler } from '../flavours/permit/logic/useCreatePermitHandler'
import { createPermitStore } from './permits'
import { Action, ActionContext, ActionHandler, ActionHandlerState, InjectedActionsContext, Objective } from './types'
import { actionToConfig, useContractAction } from './useContractAction'
import { useCreateActions } from './useCreateActions'

export interface UseActionHandlersOptions {
  onFinish?: () => void
  enabled: boolean
  context?: InjectedActionsContext
}

export interface UseActionHandlersResult {
  handlers: ActionHandler[]
  settingsDisabled: boolean // @note: after first interaction, we don't enable for settings to change
  isWalletCapabilitiesCheckPending: boolean
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

  const { data: capabilities, isPending: isWalletCapabilitiesCheckPending } = useCapabilities()
  const canBatch = capabilities?.[chainId]?.atomicBatch?.supported === true

  const actions = useCreateActions({
    objectives,
    actionsSettings: { ...actionsSettings, preferPermits: canBatch ? false : actionsSettings.preferPermits },
    actionContext,
  })

  const { data: id, writeContracts, status: writeContractsStatus, error } = useWriteContracts()
  const { data: callsStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
    },
  })

  const batchConfigs = actions.map((action) => actionToConfig(action, actionContext))

  const batchHandler: ActionHandler = {
    action: { type: 'batch', actions },
    state: mapBatchStatusToHandlerState(enabled, callsStatus?.status, writeContractsStatus, error),
    onAction: () =>
      writeContracts({
        contracts: batchConfigs.map((config) => config.getWriteConfig()) as ContractFunctionParameters[],
      }),
  }

  const queryClient = useQueryClient()
  useOnDepsChange(
    function invalidateQueriesOnConfirmed() {
      if (callsStatus?.status === 'CONFIRMED') {
        for (const config of batchConfigs) {
          const queryKeys = config.invalidates()
          for (const queryKey of queryKeys) {
            void queryClient.invalidateQueries({ queryKey })
          }
        }
        onFinish?.()
      }
    },
    [callsStatus?.status],
  )

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
    handlers: canBatch ? [batchHandler] : handlers,
    settingsDisabled,
    isWalletCapabilitiesCheckPending,
  }
}

function mapBatchStatusToHandlerState(
  enabled: boolean,
  callsStatus: 'PENDING' | 'CONFIRMED' | undefined,
  writeContractsStatus: 'success' | 'error' | 'idle' | 'pending',
  error: UseWriteContractsReturnType['error'],
): ActionHandlerState {
  if (!enabled) {
    return { status: 'disabled' }
  }
  if (writeContractsStatus === 'pending' || (writeContractsStatus === 'success' && callsStatus !== 'CONFIRMED')) {
    return { status: 'loading' }
  }
  if (callsStatus === 'CONFIRMED') {
    return { status: 'success' }
  }
  if (error) {
    return { status: 'error', errorKind: 'tx-submission', message: error.message }
  }
  return {
    status: 'ready',
  }
}
