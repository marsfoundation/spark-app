import { useTimestamp } from '@/utils/useTimestamp'
import { useCallback } from 'react'
import { Timeframe } from '../defaults'
import { filterChartData } from './filterChartData'

export function useFilterChartDataByTimeframe(timeframe: Timeframe): <T extends { date: Date }>(data: T[]) => T[] {
  const { timestamp, timestampInMs } = useTimestamp()
  return useCallback(
    <T extends { date: Date }>(data: T[]) => filterChartData({ data, timeframe, timestamp, timestampInMs }),
    [timeframe, timestamp, timestampInMs],
  )
}
