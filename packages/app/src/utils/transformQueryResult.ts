import { UseQueryResult } from '@tanstack/react-query'

export type QueryResultState<T, E = unknown> =
  | {
      isPending: true
      isError: false
      error: null
      data: undefined
    }
  | {
      isPending: false
      isError: false
      error: null
      data: T
    }
  | {
      isPending: false
      isError: true
      error: E
      data: T | undefined
    }

export function transformQueryResult<T, D, E = unknown>(
  queryResult: UseQueryResult<T, E>,
  transform: (data: T) => D,
): QueryResultState<D, E> {
  if (queryResult.isPending) {
    return queryResult
  }

  if (queryResult.isError) {
    if (queryResult.data) {
      return { ...queryResult, data: transform(queryResult.data) }
    }
    return { ...queryResult, data: undefined }
  }

  return { ...queryResult, data: transform(queryResult.data) }
}
