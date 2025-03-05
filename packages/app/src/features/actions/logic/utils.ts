import { aaveContractErrors } from '@/config/aaveContractErrors'
import { UseWriteResult } from '@/domain/hooks/useWrite'
import { BaseError } from 'viem'
import { ActionHandlerState } from './types'

export function mapWriteResultToActionState(result: UseWriteResult): ActionHandlerState {
  switch (result.status.kind) {
    case 'ready':
      return { status: 'ready' }

    case 'disabled':
      return { status: 'disabled' }

    case 'simulating':
    case 'tx-mining':
    case 'tx-sending':
      return { status: 'loading' }

    case 'error':
      return {
        status: 'error',
        errorKind: result.status.errorKind,
        message: parseWriteErrorMessage(result.status.error),
      }

    case 'success':
      return { status: 'success' }
  }
}

export function parseWriteErrorMessage(
  error: Error | undefined,
  { isBatchWrite }: { isBatchWrite?: boolean } = {},
): string {
  if (error instanceof BaseError) {
    return decodeRevertReason(isBatchWrite ? error.details : error.shortMessage)
  }
  return 'Unknown error'
}

function decodeRevertReason(errorMessage: string): string {
  const match = errorMessage.match(/reverted with the following reason:\s*(\d+)/)
  const revertReason = match?.[1]
  if (revertReason) {
    return aaveContractErrors[revertReason] ?? errorMessage
  }
  return errorMessage
}
