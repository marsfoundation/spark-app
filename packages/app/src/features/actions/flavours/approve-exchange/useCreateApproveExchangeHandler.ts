import { SwapInfoSimplified } from '@/domain/exchanges/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { ActionHandler, ActionHandlerState } from '../../logic/types'
import { useCreateApproveHandler } from '../approve/logic/useCreateApproveHandler'
import { ApproveExchangeAction } from './types'

export interface UseCreateApproveExchangeActionHandlerOptions {
  enabled: boolean
}

export function useCreateApproveExchangeActionHandler(
  action: ApproveExchangeAction,
  { enabled }: UseCreateApproveExchangeActionHandlerOptions,
): ActionHandler {
  const approveValue = action.swapInfo.data?.estimate.fromAmount // we can't use swapParams.value because of reversed swaps
  const approveValueNormalized = approveValue
    ? action.swapParams.fromToken.fromBaseUnit(approveValue)
    : NormalizedUnitNumber(0)
  const spender = action.swapInfo.data?.txRequest.to

  const approveActionHandler = useCreateApproveHandler(
    {
      type: 'approve',
      token: action.swapParams.fromToken,
      spender: spender!,
      value: approveValueNormalized,
    },
    {
      enabled: enabled && action.swapInfo.data !== undefined,
    },
  )

  return extendApproveHandler(action, action.swapInfo, approveActionHandler, enabled)
}

function extendApproveHandler(
  action: ApproveExchangeAction,
  swapInfo: SwapInfoSimplified,
  approveActionHandler: ActionHandler,
  enabled: boolean,
): ActionHandler {
  const state: ActionHandlerState = (() => {
    if (!enabled) {
      return { status: 'disabled' }
    }

    if (swapInfo.status === 'error') {
      return { status: 'error', message: swapInfo.error.message }
    }

    if (swapInfo.status === 'pending') {
      return { status: 'loading' }
    }

    return approveActionHandler.state
  })()

  return {
    state,
    action,
    onAction: approveActionHandler.onAction,
  }
}
