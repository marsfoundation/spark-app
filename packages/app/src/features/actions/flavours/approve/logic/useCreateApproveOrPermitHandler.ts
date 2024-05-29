import { useOriginChainId } from '@/domain/hooks/useOriginChainId'
import { ApproveAction } from '@/features/actions/flavours/approve/types'
import { PermitStore, isPermitSupported } from '@/features/actions/logic/permits'
import { ActionHandler } from '@/features/actions/logic/types'

import { useCreateApproveHandler } from './useCreateApproveHandler'
import { useCreatePermitHandler } from './useCreatePermitHandler'

export interface UseCreateApproveOrPermitHandlerOptions {
  enabled: boolean
  permitStore?: PermitStore
}

export function useCreateApproveOrPermitHandler(
  action: ApproveAction,
  { enabled, permitStore }: UseCreateApproveOrPermitHandlerOptions,
): ActionHandler {
  const chainId = useOriginChainId()
  const supportsPermit = isPermitSupported(chainId, action.token)

  const shouldUsePermit = permitStore !== undefined && !!supportsPermit
  const approveEnabled = enabled && !shouldUsePermit
  const permitEnabled = enabled && shouldUsePermit

  const approveAction = useCreateApproveHandler(action, {
    enabled: approveEnabled,
  })
  const permitAction = useCreatePermitHandler(action, {
    enabled: permitEnabled,
    permitStore,
  })

  return shouldUsePermit ? permitAction : approveAction
}
