import { SimplifiedQueryResult } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'
import { GeneralStatsQueryResult, generalStatsQueryOptions } from './generalStatsQueryOptions'

export type UseGeneralStatsResult = SimplifiedQueryResult<GeneralStatsQueryResult>

export function useGeneralStats(): UseGeneralStatsResult {
  return useQuery(generalStatsQueryOptions())
}
