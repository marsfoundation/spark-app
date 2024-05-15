import { QueryKey } from '@tanstack/react-query'

export interface UnsupportedSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<undefined>
}

export function unsupportedSavingsInfoQuery(): UnsupportedSavingsInfoQueryOptions {
  return {
    queryKey: ['unsupported-savings-info'],
    queryFn: async () => undefined,
  }
}
