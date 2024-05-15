import { QueryKey } from '@tanstack/react-query'

export interface UnsupportedSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<null>
}

export function unsupportedSavingsInfoQuery(): UnsupportedSavingsInfoQueryOptions {
  return {
    queryKey: ['unsupported-savings-info'],
    queryFn: async () => null,
  }
}
