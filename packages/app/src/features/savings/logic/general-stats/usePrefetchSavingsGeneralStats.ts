import { useQueryClient } from '@tanstack/react-query'
import { generalStatsQueryOptions } from './generalStatsQueryOptions'

export function usePrefetchSavingsGeneralStats() {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery(generalStatsQueryOptions())
}
