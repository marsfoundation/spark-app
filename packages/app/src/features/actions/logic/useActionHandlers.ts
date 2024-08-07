import { getChainConfigEntry } from '@/config/chain'
import { useActionsSettings } from '@/domain/state'
import { raise } from '@/utils/assert'
import { useMemo, useRef, useState } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { useCreateApproveDelegationHandler } from '../flavours/approve-delegation/useCreateApproveDelegationHandler'
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
import { useAction } from './useAction'
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
  { onFinish, enabled }: UseActionHandlersOptions,
): UseActionHandlersResult {
  const actions = useCreateActions(objectives)
  const actionsSettings = useActionsSettings()
  const chainId = useChainId()
  const { address } = useAccount()
  const wagmiConfig = useConfig()
  const permitStore = useMemo(() => createPermitStore(), [])
  const { permitSupport } = getChainConfigEntry(chainId)

  const [currentActionIndex, setCurrentActionIndex] = useState(0)

  const newHandlers: ActionHandler[] = actions.map((action, index) => ({
    action,
    onAction: () => {},
    state: { status: index === currentActionIndex ? 'ready' : index < currentActionIndex ? 'success' : 'disabled' },
  }))

  // @note: we call react hooks in a loop but this is'disabled'ne as actions should never change
  const handlers = actions.reduce((acc, action, index) => {
    const useNewHandler =
      (action.type === 'approve' && permitSupport[action.token.address] !== true) || action.type === 'deposit'

    // biome-ignore lint/correctness/useHookAtTopLevel:
    const handler = useCreateActionHandler(action, {
      enabled: !useNewHandler && enabled && index === currentActionIndex,
      permitStore: actionsSettings.preferPermits ? permitStore : undefined,
    })

    if (index < currentActionIndex) {
      handler.state.status = 'success'
    }

    return [...acc, handler]
  }, [] as ActionHandler[])

  const currentAction = actions[currentActionIndex]!
  const useNewHandler =
    (currentAction.type === 'approve' && permitSupport[currentAction.token.address] !== true) ||
    currentAction.type === 'deposit'

  const newHandler = useAction({
    action: currentAction,
    context: {
      account: address ?? raise('Not connected'),
      chainId,
      wagmiConfig,
      permitStore,
    },
    enabled: useNewHandler && enabled,
  })
  const legacyHandler = handlers[currentActionIndex]
  const currentActionHandler = useNewHandler ? newHandler : legacyHandler

  if (currentActionHandler?.state.status === 'success') {
    if (currentActionIndex === actions.length - 1) {
      onFinish?.()
    } else {
      setCurrentActionIndex(currentActionIndex + 1)
    }
  }

  if (currentActionHandler) {
    newHandlers[currentActionIndex] = currentActionHandler
  }

  const settingsDisabled = currentActionIndex > 0

  return {
    handlers: newHandlers,
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
