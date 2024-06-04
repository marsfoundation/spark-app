import { FetchStatus } from '@tanstack/react-query'

import { UseWriteResult } from '@/domain/hooks/useWrite'
import { useHasEnoughBorrowAllowance } from '@/domain/market-operations/borrow-allowance/useHasEnoughBorrowAllowance'
import { useApproveDelegation } from '@/domain/market-operations/useApproveDelegation'

import { ActionHandler, ActionHandlerState } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { ApproveDelegationAction } from './types'

export interface UseCreateApproveDelegationHandlerOptions {
  enabled: boolean
}

export function useCreateApproveDelegationHandler(
  action: ApproveDelegationAction,
  { enabled }: UseCreateApproveDelegationHandlerOptions,
): ActionHandler {
  const {
    data: hasEnoughAllowance,
    fetchStatus: hasEnoughAllowanceFetchStatus,
    error: hasEnoughAllowanceError,
  } = useHasEnoughBorrowAllowance({
    debtTokenAddress: action.debtTokenAddress,
    toUser: action.delegatee,
    value: action.token.toBaseUnit(action.value),
    enabled,
  })

  const approve = useApproveDelegation({
    debtTokenAddress: action.debtTokenAddress,
    delegatee: action.delegatee,
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
  hasEnoughBorrowAllowance: boolean | undefined,
  hasEnoughBorrowAllowanceFetchStatus: FetchStatus,
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
  if (hasEnoughBorrowAllowance && hasEnoughBorrowAllowanceFetchStatus === 'idle') {
    return { status: 'success' }
  }
  // user went through the approval flow but manually tweaked approval level and it's still too low
  if (approve.status.kind === 'success' && hasEnoughBorrowAllowance === false) {
    if (hasEnoughBorrowAllowanceFetchStatus === 'fetching') {
      return { status: 'loading' }
    }

    return { status: 'ready' }
  }

  return mapWriteResultToActionState(approve)
}
