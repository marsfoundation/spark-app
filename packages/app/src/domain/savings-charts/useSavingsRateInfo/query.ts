import { infoSkyApiUrl } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { assert } from '@/utils/assert'
import { queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { z } from 'zod'
import { SavingsRateInfo } from './types'

interface SavingsRateQueryParams {
  chainId: number
  staleTime: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsRateQueryOptions({ chainId, staleTime }: SavingsRateQueryParams) {
  return queryOptions<SavingsRateInfo>({
    queryKey: savingsRateInfoQueryKey({ chainId }),
    queryFn: async () => {
      const res = await fetch(`${infoSkyApiUrl}/savings-rate/`)

      if (!res.ok) {
        throw new Error(`Failed to fetch savings rate data: ${res.statusText}`)
      }

      const data = savingsRateDataResponseSchema.parse(await res.json())

      return data
    },
    staleTime,
  })
}

export function savingsRateInfoQueryKey({ chainId }: Omit<SavingsRateQueryParams, 'staleTime'>): unknown[] {
  return ['savings-rate', chainId]
}

const savingsRateDataResponseSchema = z
  .array(
    z.object({
      date: z.string().transform((value) => new Date(value)),
      rate: z.string().transform((value) => NormalizedUnitNumber(value)),
      dsr_rate: z.string().transform((value) => NormalizedUnitNumber(value)),
      ssr_rate: z
        .string()
        .nullable()
        .transform((value) => (value ? NormalizedUnitNumber(value) : null)),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    const savingsRateInfo: SavingsRateInfo = { ssr: [], dsr: [] }

    for (const item of sortedData) {
      const { date, dsr_rate, ssr_rate } = item

      savingsRateInfo.dsr.push({ date, rate: dsr_rate })

      // Defaulting to dsr_rate if ssr_rate is null
      savingsRateInfo.ssr.push({ date, rate: ssr_rate ?? dsr_rate })
    }

    return savingsRateInfo
  })

interface SavingsRateFilteredQueryParams {
  chainId: number
  staleTime: number
  currentTimestamp: number
  timeframe: Timeframe
  savingsRateInfo?: SavingsRateInfo
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsRateFilteredQueryOptions({
  chainId,
  staleTime,
  currentTimestamp,
  timeframe,
  savingsRateInfo,
}: SavingsRateFilteredQueryParams) {
  return queryOptions({
    queryKey: [...savingsRateInfoQueryKey({ chainId }), timeframe, currentTimestamp],
    queryFn: () => {
      assert(savingsRateInfo, 'Savings rate info should be loaded before filtering')

      const ssr = filterDataByTimeframe({
        data: savingsRateInfo.ssr,
        timeframe,
        currentTimestamp,
      })

      const dsr = filterDataByTimeframe({
        data: savingsRateInfo.dsr,
        timeframe,
        currentTimestamp,
      })

      return {
        ssr,
        dsr,
      }
    },
    enabled: !!savingsRateInfo,
    staleTime,
  })
}
