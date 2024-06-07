import { useMemo, useRef } from 'react'

import { useActionsSettings } from '@/domain/state'

import { useCreateApproveDelegationHandler } from '../flavours/approve-delegation/useCreateApproveDelegationHandler'
import { useCreateApproveExchangeActionHandler } from '../flavours/approve-exchange/useCreateApproveExchangeHandler'
import { useCreateApproveOrPermitHandler } from '../flavours/approve/logic/useCreateApproveOrPermitHandler'
import { useCreateBorrowActionHandler } from '../flavours/borrow/useCreateBorrowHandler'
import { useCreateDepositHandler } from '../flavours/deposit/useCreateDepositHandler'
import { useCreateExchangeHandler } from '../flavours/exchange/useCreateExchangeHandler'
import { useCreateNativeSDaiDepositHandler } from '../flavours/native-sdai-deposit/useCreateNativeSDaiDepositHandler'
import { useCreateNativeSDaiWithdrawHandler } from '../flavours/native-sdai-withdraw/useCreateNativeSDaiWithdrawHandler'
import { useCreateRepayHandler } from '../flavours/repay/useCreateRepayHandler'
import { useCreateSetUseAsCollateralHandler } from '../flavours/set-use-as-collateral/useCreateSetUseAsCollateralHandler'
import { useCreateSetUserEModeHandler } from '../flavours/set-user-e-mode/useCreateSetUserEModeHandler'
import { useCreateWithdrawHandler } from '../flavours/withdraw/useCreateWithdrawHandler'
import { PermitStore, createPermitStore } from './permits'
import { Action, ActionHandler, Objective } from './types'
import { useCreateActions } from './useCreateActions'

export interface UseActionHandlersOptions {
  onFinish?: () => void
  enabled: boolean
}

export interface UseActionHandlersResult {
  handlers: ActionHandler[]
  settingsDisabled: boolean // @note: after first interaction, we don't enable for settings to change
}

export function useActionHandlers(
  objectives: Objective[],
  { onFinish: _onFinish, enabled }: UseActionHandlersOptions,
): UseActionHandlersResult {
  const actions = useCreateActions(objectives)
  const permitStore = useMemo(() => createPermitStore(), [])
  const actionsSettings = useActionsSettings()

  // @note: we call react hooks in a loop but this is fine as actions should never change
  const handlers = actions.reduce((acc, action, index) => {
    const nextOneToExecute = index > 0 ? acc[acc.length - 1]!.state.status === 'success' : true
    // If succeeded once, don't try again. Further actions can invalidate previous actions (for example deposit will invalidate previous approvals)
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    const alreadySucceeded = useRef(false)

    const isLast = index === actions.length - 1
    const onFinish = isLast ? _onFinish : undefined

    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    const handler = useCreateActionHandler(action, {
      enabled: enabled && alreadySucceeded.current === false && nextOneToExecute,
      permitStore: actionsSettings.preferPermits ? permitStore : undefined,
      onFinish,
    })

    if (alreadySucceeded.current) {
      handler.state.status = 'success'
    }

    if (handler.state.status === 'success') {
      alreadySucceeded.current = true
    }

    return [...acc, handler]
  }, [] as ActionHandler[])

  const settingsDisabled = handlers.some((handler) => handler.state.status === 'success')

  return {
    handlers,
    settingsDisabled,
  }
}

interface UseCreateActionHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
  onFinish?: () => void
}
function useCreateActionHandler(
  action: Action,
  { enabled, permitStore, onFinish }: UseCreateActionHandlerOptions,
): ActionHandler {
  switch (action.type) {
    case 'approve':
    case 'permit':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateApproveOrPermitHandler(action, { permitStore, enabled })
    case 'deposit':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateDepositHandler(action, { permitStore, enabled, onFinish })
    case 'approveDelegation':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateApproveDelegationHandler(action, { enabled })
    case 'borrow':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateBorrowActionHandler(action, { enabled, onFinish })
    case 'withdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateWithdrawHandler(action, { enabled, onFinish })
    case 'repay':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateRepayHandler(action, { permitStore, enabled, onFinish })
    case 'setUseAsCollateral':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateSetUseAsCollateralHandler(action, { enabled, onFinish })
    case 'setUserEMode':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateSetUserEModeHandler(action, { enabled, onFinish })
    case 'approveExchange':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateApproveExchangeActionHandler(action, { enabled })
    case 'exchange':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateExchangeHandler(action, { enabled, onFinish })
    case 'nativeSDaiDeposit':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateNativeSDaiDepositHandler(action, { enabled, onFinish })
    case 'nativeSDaiWithdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
      return useCreateNativeSDaiWithdrawHandler(action, { enabled, onFinish })
  }
}
