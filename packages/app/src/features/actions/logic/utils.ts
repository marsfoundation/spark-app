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

export function parseWriteErrorMessage(error: Error | undefined): string {
  if (error instanceof BaseError) {
    return decodeRevertReason(error)
  }
  return 'Unknown error'
}

function decodeRevertReason(error: BaseError): string {
  const match = error.shortMessage.match(/execution reverted:\s*(\d+)/)
  const revertReason = match?.[1]
  if (revertReason) {
    return aaveContractErrors[revertReason] ?? error.shortMessage
  }
  return error.shortMessage
}
