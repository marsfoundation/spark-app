import { getChainConfigEntry } from '@/config/chain'
import { useActionsSettings } from '@/domain/state'
import { raise } from '@/utils/assert'
import { useMemo, useRef } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useCreateApproveDelegationHandler } from '../flavours/approve-delegation/useCreateApproveDelegationHandler'
import { useAction } from '../flavours/approve/logic/useAction'
import { useCreateApproveOrPermitHandler } from '../flavours/approve/logic/useCreateApproveOrPermitHandler'
import { useCreateBorrowActionHandler } from '../flavours/borrow/useCreateBorrowHandler'
import { useCreateClaimRewardsHandler } from '../flavours/claim-rewards/useCreateClaimRewardsHandler'
import { useCreateDepositHandler } from '../flavours/deposit/useCreateDepositHandler'
import { useCreateMakerStableToSavingsHandler } from '../flavours/native-sdai-deposit/maker-stables/useCreateMakerStableToSavingsHandler'
import { useCreateMigrateDAIToSNSTHandler } from '../flavours/native-sdai-deposit/migrate-dai-to-snst/useCreateMigrateDAIToSNSTActionHandler'
import { useCreateUSDCToSDaiDepositHandler } from '../flavours/native-sdai-deposit/usdc-to-sdai/useCreateUSDCToSDaiDepositHandler'
import { useCreateXDaiToSDaiDepositHandler } from '../flavours/native-sdai-deposit/xdai-to-sdai/useCreateXDaiToSDaiDepositHandler'
import { useCreateDaiFromSDaiWithdrawHandler } from '../flavours/native-sdai-withdraw/dai-from-sdai/useCreateDaiFromSDaiWithdrawHandler'
import { useCreateUSDCFromSDaiWithdrawHandler } from '../flavours/native-sdai-withdraw/usdc-from-sdai/useCreateUSDCFromSDaiWithdrawHandler'
import { useCreateXDaiFromSDaiWithdrawHandler } from '../flavours/native-sdai-withdraw/xdai-from-sdai/useCreateXDaiFromSDaiWithdrawHandler'
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

  const chainId = useChainId()
  const { address } = useAccount()
  const wagmiConfig = useConfig()

  // @note: we call react hooks in a loop but this is fine as actions should never change
  const handlers = actions.reduce((acc, action, index) => {
    const nextOneToExecute = index > 0 ? acc[acc.length - 1]!.state.status === 'success' : true
    // If succeeded once, don't try again. Further actions can invalidate previous actions (for example deposit will invalidate previous approvals)
    // biome-ignore lint/correctness/useHookAtTopLevel:
    const alreadySucceeded = useRef(false)

    const isLast = index === actions.length - 1
    const onFinish = isLast ? _onFinish : undefined

    // biome-ignore lint/correctness/useHookAtTopLevel:
    const legacyHandler = useCreateActionHandler(action, {
      enabled: enabled && alreadySucceeded.current === false && nextOneToExecute,
      permitStore: actionsSettings.preferPermits ? permitStore : undefined,
      onFinish,
    })

    // biome-ignore lint/correctness/useHookAtTopLevel:
    const newHandler = useAction({
      action,
      context: {
        account: address ?? raise('Not connected'),
        chainId,
        wagmiConfig,
        enabled: enabled && alreadySucceeded.current === false && nextOneToExecute,
      },
    })

    const { permitSupport } = getChainConfigEntry(chainId)
    const handler =
      action.type === 'approve' && permitSupport[action.token.address] !== true ? newHandler : legacyHandler

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
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateApproveOrPermitHandler(action, { permitStore, enabled })
    case 'deposit':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateDepositHandler(action, { permitStore, enabled, onFinish })
    case 'approveDelegation':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateApproveDelegationHandler(action, { enabled })
    case 'borrow':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateBorrowActionHandler(action, { enabled, onFinish })
    case 'withdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateWithdrawHandler(action, { enabled, onFinish })
    case 'repay':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateRepayHandler(action, { permitStore, enabled, onFinish })
    case 'setUseAsCollateral':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateSetUseAsCollateralHandler(action, { enabled, onFinish })
    case 'setUserEMode':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateSetUserEModeHandler(action, { enabled, onFinish })
    case 'makerStableToSavings':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateMakerStableToSavingsHandler(action, { enabled, onFinish })
    case 'daiFromSDaiWithdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateDaiFromSDaiWithdrawHandler(action, { enabled, onFinish })
    case 'usdcToSDaiDeposit':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateUSDCToSDaiDepositHandler(action, { enabled, onFinish })
    case 'usdcFromSDaiWithdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateUSDCFromSDaiWithdrawHandler(action, { enabled, onFinish })
    case 'xDaiToSDaiDeposit':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateXDaiToSDaiDepositHandler(action, { enabled, onFinish })
    case 'xDaiFromSDaiWithdraw':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateXDaiFromSDaiWithdrawHandler(action, { enabled, onFinish })
    case 'claimRewards':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateClaimRewardsHandler(action, { enabled, onFinish })
    case 'migrateDAIToSNST':
      // biome-ignore lint/correctness/useHookAtTopLevel:
      return useCreateMigrateDAIToSNSTHandler(action, { enabled, onFinish })
  }
}
