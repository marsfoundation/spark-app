import { UseQueryResult } from '@tanstack/react-query'

export type SimplifiedQueryResult<T> =
  | {
      status: 'pending'
      data: undefined
      error?: null
    }
  | {
      status: 'success'
      data: T
      error?: null
    }
  | {
      status: 'error'
      data: undefined
      error: Error
    }

export function simplifyQueryResult<T>(result: UseQueryResult<T>): SimplifiedQueryResult<T> {
  return {
    data: result.data,
    status: result.status,
    error: result.error,
  } as any
}
