import { infoSkyApiUrl } from '@/config/consts'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Timeframe } from '@/ui/charts/defaults'
import { filterChartData } from '@/ui/charts/logic/filterChartData'
import { queryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'
import { z } from 'zod'
import { FarmHistoryItem } from './types'

export interface FarmHistoricDataParameters {
  chainId: number
  farmAddress: CheckedAddress
  timeframe: Timeframe
  timestamp: number
  timestampInMs: number
  historyCutoff?: Date
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmHistoricDataQueryOptions({
  chainId,
  farmAddress,
  historyCutoff,
  timeframe,
  timestamp,
  timestampInMs,
}: FarmHistoricDataParameters) {
  return queryOptions({
    queryKey: ['farm-historic-data', chainId, farmAddress],
    queryFn: async () => {
      const res = await fetch(`${infoSkyApiUrl}/farms/${farmAddress.toLowerCase()}/historic/`)
      if (!res.ok) {
        throw new Error(`Failed to fetch farm data: ${res.statusText}`)
      }

      const data = historicDataResponseSchema.parse(await res.json())

      if (historyCutoff) {
        return data.filter((result) => result.date >= historyCutoff)
      }

      return data
    },
    select: useCallback(
      (data: FarmHistoryItem[]) => filterChartData({ data, timeframe, timestamp, timestampInMs }),
      [timeframe, timestamp, timestampInMs],
    ),
  })
}

const historicDataResponseSchema = z
  .object({
    results: z.array(
      z.object({
        date: z.string().transform((value) => new Date(value)),
        apr: z.string().transform((value) => Percentage(value, true)),
        total_staked: z.string().transform((value) => NormalizedUnitNumber(value)),
      }),
    ),
  })
  .transform((value) =>
    value.results.map((result) => ({
      date: result.date,
      apr: result.apr,
      totalStaked: result.total_staked,
    })),
  )
