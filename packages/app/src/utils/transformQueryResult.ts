import { UseQueryResult } from '@tanstack/react-query'
import { SimplifiedQueryResult } from './types'

export function transformQueryResult<T, D, E = unknown>(
  queryResult: UseQueryResult<T, E>,
  transform: (data: T) => D,
): SimplifiedQueryResult<D, E> {
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
