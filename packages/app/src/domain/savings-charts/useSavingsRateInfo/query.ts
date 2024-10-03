import { infoSkyApiUrl } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { z } from 'zod'
import { SavingsRateInfo } from './types'

interface SavingsRateQueryParams {
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsRateQueryOptions({ chainId }: SavingsRateQueryParams) {
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
  })
}

export function savingsRateInfoQueryKey({ chainId }: SavingsRateQueryParams): unknown[] {
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
        .nullish()
        .transform((value) => (value ? NormalizedUnitNumber(value) : null)),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    const savingsRateInfo = sortedData.reduce(
      (acc, item) => {
        const date = item.date
        const dsrRate = item.dsr_rate
        const ssrRate = item.ssr_rate || dsrRate

        acc.dsr.push({
          date,
          rate: dsrRate,
        })

        acc.ssr.push({
          date,
          rate: ssrRate,
        })

        return acc
      },
      { ssr: [], dsr: [] } as SavingsRateInfo,
    )

    return savingsRateInfo
  })
