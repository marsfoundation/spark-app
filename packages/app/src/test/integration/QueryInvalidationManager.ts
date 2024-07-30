import { InvalidateOptions, InvalidateQueryFilters, QueryClient, QueryKey } from '@tanstack/react-query'
import { MockInstance, vi } from 'vitest'

export class QueryInvalidationManager {
  private readonly invalidateQueriesSpy: MockInstance<
    [filters?: InvalidateQueryFilters | undefined, options?: InvalidateOptions | undefined],
    Promise<void>
  >

  constructor(queryClient: QueryClient) {
    this.invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')
  }

  hasBeenInvalidated(queryKey: QueryKey): boolean {
    return this.invalidateQueriesSpy.mock.calls.some((call) => {
      const filterQueryKey = call[0]?.queryKey
      if (!filterQueryKey) {
        return false
      }
      return partialMatchKey(queryKey, filterQueryKey)
    })
  }

  reset(): void {
    this.invalidateQueriesSpy.mockClear()
  }
}

// copied from https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts
function partialMatchKey(a: any, b: any): boolean {
  if (a === b) {
    return true
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return !Object.keys(b).some((key) => !partialMatchKey(a[key], b[key]))
  }

  return false
}
