import { BaseError } from 'viem'

import { UseWriteResult } from '@/domain/hooks/useWrite'

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
    return error.shortMessage
  }
  return 'Unknown error'
}
