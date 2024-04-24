import { useExchange, UseExchangeResult } from '@/domain/market-operations/useExchange'

import { ActionHandler, ActionHandlerState } from '../../logic/types'
import { parseWriteErrorMessage } from '../../logic/utils'
import { ExchangeAction } from './types'

export interface UseCreateExchangeHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateExchangeHandler(
  action: ExchangeAction,
  { enabled, onFinish }: UseCreateExchangeHandlerOptions,
): ActionHandler {
  const exchange = useExchange({
    swapInfo: action.swapInfo,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapSendResultToActionState(exchange),
    onAction: exchange.send,
  }
}

function mapSendResultToActionState(result: UseExchangeResult): ActionHandlerState {
  switch (result.status.kind) {
    case 'ready':
      return { status: 'ready' }

    case 'disabled':
      return { status: 'disabled' }

    case 'fetching-quote':
    case 'simulating':
    case 'tx-mining':
    case 'tx-sending':
      return { status: 'loading' }

    case 'error':
      if (result.status.errorKind === 'fetching-quote-error') {
        return { status: 'error', message: 'Error fetching exchange quote' }
      }

      return {
        status: 'error',
        errorKind: result.status.errorKind,
        message: parseWriteErrorMessage(result.status.error),
      }

    case 'success':
      return { status: 'success' }
  }
}
