import { useQueryClient } from '@tanstack/react-query'
import { generalStatsQueryOptions } from './generalStatsQueryOptions'

export function usePrefetchSavingsGeneralStats(): void {
  const queryClient = useQueryClient()
  void queryClient.prefetchQuery(generalStatsQueryOptions())
}
