import { FetchStatus } from '@tanstack/react-query'

import { UseWriteResult } from '@/domain/hooks/useWrite'
import { useHasEnoughAllowance } from '@/domain/market-operations/allowance/useHasEnoughAllowance'
import { useApprove } from '@/domain/market-operations/useApprove'
import { ApproveAction } from '@/features/actions/flavours/approve/types'
import { ActionHandler, ActionHandlerState } from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'

export interface UseCreateApproveHandlerOptions {
  enabled: boolean
}

export function useCreateApproveHandler(
  action: ApproveAction,
  { enabled }: UseCreateApproveHandlerOptions,
): ActionHandler {
  const token = action.token
  const requiredValue = token.toBaseUnit(action.requiredValue ?? action.value)
  const {
    data: hasEnoughAllowance,
    fetchStatus: hasEnoughAllowanceFetchStatus,
    error: hasEnoughAllowanceError,
  } = useHasEnoughAllowance({
    token: token.address,
    spender: action.spender,
    value: requiredValue,
    enabled,
  })

  const approve = useApprove({
    token: action.token.address,
    spender: action.spender,
    value: action.token.toBaseUnit(action.value),
    enabled: enabled && hasEnoughAllowance === false,
  })

  const state = mapStatusesToActionState(
    hasEnoughAllowance,
    hasEnoughAllowanceFetchStatus,
    hasEnoughAllowanceError,
    approve,
    enabled,
  )

  return {
    action,
    state,
    onAction: approve.write,
  }
}

function mapStatusesToActionState(
  hasEnoughAllowance: boolean | undefined,
  hasEnoughAllowanceFetchStatus: FetchStatus,
  hasEnoughAllowanceError: Error | null,
  approve: UseWriteResult,
  enabled: boolean,
): ActionHandlerState {
  if (!enabled) {
    return { status: 'disabled' }
  }

  if (hasEnoughAllowanceError) {
    return { status: 'error', errorKind: 'simulation', message: hasEnoughAllowanceError.message }
  }

  // user already has allowance
  if (hasEnoughAllowance && hasEnoughAllowanceFetchStatus === 'idle') {
    return { status: 'success' }
  }
  // user went through the approval flow but manually tweaked approval level and it's still too low
  if (approve.status.kind === 'success' && hasEnoughAllowance === false) {
    if (hasEnoughAllowanceFetchStatus === 'fetching') {
      return { status: 'loading' }
    }

    return { status: 'ready' }
  }

  if (approve.status.kind === 'disabled' && hasEnoughAllowanceFetchStatus === 'fetching') {
    return { status: 'loading' }
  }

  return mapWriteResultToActionState(approve)
}
