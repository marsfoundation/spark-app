export type SimplifiedQueryResult<T, E = unknown> =
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

export function transformSimplifiedQueryResult<T, R>(
  result: SimplifiedQueryResult<T>,
  transform: (data: T) => R,
): SimplifiedQueryResult<R> {
  if (result.isPending) {
    return result
  }

  if (result.isError) {
    const data = result.data ? transform(result.data) : undefined
    return { ...result, data }
  }

  return { ...result, data: transform(result.data) }
}
