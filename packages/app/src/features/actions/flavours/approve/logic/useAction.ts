import { UseWriteResult, useWrite } from '@/domain/hooks/useWrite'
import { Action, ActionHandler, ActionHandlerState } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ActionConfig,
  ActionContext,
  FetchActionDataResult,
  VerifyTransactionResult,
  createApproveActionConfig,
} from './approve-action'

export interface UseActionParams {
  context: ActionContext
  action: Action
}
export function useAction({ action, context }: UseActionParams): ActionHandler {
  const config = actionToConfig(action, context)
  const { actionDataQueryOptions, getWriteConfig, verifyTransactionQueryOptions, invalidates } = config

  const queryClient = useQueryClient()
  const actionData = useQuery(actionDataQueryOptions())
  const write = useWrite(getWriteConfig(actionData), {
    onTransactionSettled: () => {
      invalidates().map((queryKey) => void queryClient.invalidateQueries({ queryKey }))
    },
  })
  const verifyTransactionData = useQuery(verifyTransactionQueryOptions())

  const state = mapStatusesToActionState({
    actionData,
    write,
    verifyTransactionData,
    enabled: context.enabled,
  })

  return {
    action,
    state,
    onAction: write.write,
  }
}

interface MapStatusesToActionStateParams {
  actionData: FetchActionDataResult
  write: UseWriteResult
  verifyTransactionData: VerifyTransactionResult
  enabled: boolean
}

function mapStatusesToActionState({
  actionData,
  write,
  verifyTransactionData,
  enabled,
}: MapStatusesToActionStateParams): ActionHandlerState {
  if (!enabled) {
    return { status: 'disabled' }
  }

  if (actionData.fetchStatus === 'fetching') {
    return { status: 'loading' }
  }

  if (actionData.status === 'error') {
    return { status: 'error', errorKind: 'simulation', message: actionData.error.message }
  }

  if (actionData.data?.canBeSkipped && actionData.fetchStatus === 'idle') {
    return { status: 'success' }
  }

  if (verifyTransactionData.fetchStatus === 'fetching') {
    return { status: 'loading' }
  }

  if (verifyTransactionData.status === 'error') {
    return { status: 'error', errorKind: 'tx-submission', message: verifyTransactionData.error.message }
  }

  // Transaction result didn't reach it's objective,
  // for instance user went through the approval flow but manually tweaked approval level
  // and it's still too low
  if (write.status.kind === 'success' && verifyTransactionData.data?.success === false) {
    return { status: 'ready' }
  }

  return mapWriteResultToActionState(write)
}

function actionToConfig(action: Action, context: ActionContext): ActionConfig {
  if (action.type === 'approve') {
    return createApproveActionConfig(action, context)
  }

  return createEmptyActionConfig()
}

function createEmptyActionConfig(): ActionConfig {
  return {
    actionDataQueryOptions: () => ({ queryKey: [], queryFn: skipToken }),
    getWriteConfig: () => ({}),
    verifyTransactionQueryOptions: () => ({ queryKey: [], queryFn: skipToken }),
    invalidates: () => [],
  }
}
