import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { assertNever } from '@marsfoundation/common-universal'
import { useQueryClient } from '@tanstack/react-query'
import { ContractFunctionParameters } from 'viem'
import { useChainId, useConfig } from 'wagmi'
import { Action, ActionContext, ActionHandlerState, BatchActionHandler, InjectedActionsContext } from './types'
import { BatchWriteStatus, useBatchWrite } from './useBatchWrite'
import { actionToConfig } from './useContractAction'

export interface GetBatchHandlerParams {
  actions: Action[]
  enabled: boolean
  onFinish: () => void
  context: InjectedActionsContext | undefined
}

export function useBatchActionHandler({
  actions,
  enabled,
  onFinish,
  context: injectedContext,
}: GetBatchHandlerParams): BatchActionHandler {
  const wagmiConfig = useConfig()
  const { account } = useConnectedAddress()
  const chainId = useChainId()
  const queryClient = useQueryClient()

  const context: ActionContext = {
    ...injectedContext,
    txReceipts: [],
    wagmiConfig,
    account,
    chainId,
  }

  const batchConfigs = actions.map((action) => actionToConfig(action, context))

  const contracts = batchConfigs.map((config) => config.getWriteConfig()) as ContractFunctionParameters[]
  function onTransactionSettled(): void {
    for (const config of batchConfigs) {
      const queryKeys = config.invalidates()
      for (const queryKey of queryKeys) {
        void queryClient.invalidateQueries({ queryKey })
      }
    }
    onFinish()
  }

  const { write, status } = useBatchWrite({
    enabled,
    contracts,
    callbacks: { onTransactionSettled },
  })

  return {
    actions,
    onAction: write,
    state: mapBatchWriteStatusToBatchActionState(status),
  }
}

function mapBatchWriteStatusToBatchActionState(status: BatchWriteStatus): ActionHandlerState {
  switch (status.kind) {
    case 'disabled':
      return { status: 'disabled' }

    case 'ready':
      return { status: 'ready' }

    case 'batch-sending':
      return { status: 'loading' }

    case 'batch-confirming':
      return { status: 'loading' }

    case 'success':
      return { status: 'success' }

    case 'error':
      return { status: 'error', errorKind: status.errorKind, message: status.error.message }

    default:
      assertNever(status)
  }
}
