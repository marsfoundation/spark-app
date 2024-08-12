import { UseWriteResult, useWrite } from '@/domain/hooks/useWrite'
import {
  Action,
  ActionHandler,
  ActionHandlerState,
  InitialParamsBase,
  VerifyTransactionResultBase,
} from '@/features/actions/logic/types'
import { mapWriteResultToActionState } from '@/features/actions/logic/utils'
import { QueryKey, queryOptions, skipToken, useQuery, useQueryClient } from '@tanstack/react-query'
import { createApproveDelegationActionConfig } from '../flavours/approve-delegation/logic/approveDelegationAction'
import { createApproveActionConfig } from '../flavours/approve/logic/approveAction'
import { createBorrowActionConfig } from '../flavours/borrow/logic/borrowAction'
import { createClaimRewardsActionConfig } from '../flavours/claim-rewards/logic/claimRewardsAction'
import { createDepositToSavingsActionConfig } from '../flavours/deposit-to-savings/logic/depositToSavingsAction'
import { createDepositActionConfig } from '../flavours/deposit/logic/depositAction'
import { createRepayActionConfig } from '../flavours/repay/logic/repayAction'
import { createSetUseAsCollateralActionConfig } from '../flavours/set-use-as-collateral/logic/setUseAsCollateralAction'
import { createSetUserEModeActionConfig } from '../flavours/set-user-e-mode/logic/setUserEModeAction'
import { createWithdrawFromSavingsActionConfig } from '../flavours/withdraw-from-savings/logic/withdrawFromSavingsAction'
import { createWithdrawActionConfig } from '../flavours/withdraw/logic/withdrawAction'
import { ActionConfig, ActionContext, InitialParamsQueryResult, VerifyTransactionResult } from './types'

export interface UseContractActionParams {
  context: ActionContext
  action: Action
  enabled: boolean
}
export function useContractAction({ action, context, enabled }: UseContractActionParams): ActionHandler {
  const config = actionToConfig(action, context)
  const {
    initialParamsQueryOptions = defaultInitialParamsQueryOptions,
    getWriteConfig,
    verifyTransactionQueryOptions = defaultVerifyTransactionQueryOptions,
    invalidates,
  } = config

  const queryClient = useQueryClient()

  const initialParams = useQuery({
    ...initialParamsQueryOptions(),
    enabled,
  })

  const write = useWrite(
    {
      ...getWriteConfig(initialParams),
      enabled,
    },
    {
      onTransactionSettled: () => {
        invalidates().map((queryKey) => void queryClient.invalidateQueries({ queryKey }))
      },
    },
  )

  const verifyTransactionData = useQuery({
    ...verifyTransactionQueryOptions(),
    enabled: enabled && write.status.kind === 'success',
  })

  const state = mapStatusesToActionState({
    initialParams,
    write,
    verifyTransactionData,
    enabled,
  })

  return {
    action,
    state,
    onAction: write.write,
  }
}

interface MapStatusesToActionStateParams {
  initialParams: InitialParamsQueryResult
  write: UseWriteResult
  verifyTransactionData: VerifyTransactionResult
  enabled: boolean
}

function mapStatusesToActionState({
  initialParams,
  write,
  verifyTransactionData,
  enabled,
}: MapStatusesToActionStateParams): ActionHandlerState {
  if (!enabled) {
    return { status: 'disabled' }
  }

  if (initialParams.fetchStatus === 'fetching') {
    return { status: 'loading' }
  }

  if (initialParams.status === 'error') {
    return { status: 'error', errorKind: 'initial-params', message: initialParams.error.message }
  }

  if (initialParams.data?.canBeSkipped && initialParams.fetchStatus === 'idle') {
    return { status: 'success' }
  }

  if (verifyTransactionData.fetchStatus === 'fetching') {
    return { status: 'loading' }
  }

  if (verifyTransactionData.status === 'error') {
    return { status: 'error', errorKind: 'tx-verify', message: verifyTransactionData.error.message }
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

  if (action.type === 'deposit') {
    return createDepositActionConfig(action, context)
  }

  if (action.type === 'borrow') {
    return createBorrowActionConfig(action, context)
  }

  if (action.type === 'setUseAsCollateral') {
    return createSetUseAsCollateralActionConfig(action, context)
  }

  if (action.type === 'approveDelegation') {
    return createApproveDelegationActionConfig(action, context)
  }

  if (action.type === 'setUserEMode') {
    return createSetUserEModeActionConfig(action, context)
  }

  if (action.type === 'repay') {
    return createRepayActionConfig(action, context)
  }

  if (action.type === 'claimRewards') {
    return createClaimRewardsActionConfig(action, context)
  }

  if (action.type === 'withdraw') {
    return createWithdrawActionConfig(action, context)
  }

  if (action.type === 'withdrawFromSavings') {
    return createWithdrawFromSavingsActionConfig(action, context)
  }

  if (action.type === 'depositToSavings') {
    return createDepositToSavingsActionConfig(action, context)
  }

  return createEmptyActionConfig()
}

function createEmptyActionConfig(): ActionConfig {
  return {
    initialParamsQueryOptions: () => ({ queryKey: [], queryFn: skipToken }),
    getWriteConfig: () => ({}),
    verifyTransactionQueryOptions: () => ({ queryKey: [], queryFn: skipToken }),
    invalidates: () => [],
    beforeWriteCheck: () => {},
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function defaultInitialParamsQueryOptions() {
  return queryOptions<InitialParamsBase>({
    queryKey: ['default-initial-params'] as QueryKey,
    queryFn: () => ({ canBeSkipped: false }),
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function defaultVerifyTransactionQueryOptions() {
  return queryOptions<VerifyTransactionResultBase>({
    queryKey: ['default-verify-transaction'] as QueryKey,
    queryFn: () => ({ success: true }),
  })
}
