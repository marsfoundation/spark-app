import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { generalStatsQueryOptions } from './generalStatsQueryOptions'

export function usePrefetchSavingsGeneralStats(): void {
  const queryClient = useQueryClient()
  useEffect(() => {
    void queryClient.prefetchQuery(generalStatsQueryOptions())
  }, [queryClient])
}
