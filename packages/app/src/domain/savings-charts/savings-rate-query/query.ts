import { infoSkyApiUrl } from '@/config/consts'
import { percentageAboveOneSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { z } from 'zod'
import { SavingsRateInfoItem } from './types'

export type SavingsRateQueryResult = {
  ssr: SavingsRateInfoItem[]
  dsr: SavingsRateInfoItem[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsRateQueryOptions() {
  return queryOptions<SavingsRateQueryResult>({
    queryKey: savingsRateInfoQueryKey(),
    queryFn: async () => {
      const response = await fetch(`${infoSkyApiUrl}/savings-rate/`)
      if (!response.ok) {
        throw new Error(`Failed to fetch savings rate data: ${response.statusText}`)
      }
      const result = await response.json()
      return savingsRateDataResponseSchema.parse(result)
    },
  })
}

export function savingsRateInfoQueryKey(): QueryKey {
  return ['savings-rate']
}

const savingsRateDataResponseSchema = z
  .array(
    z.object({
      date: dateSchema,
      dsr_rate: percentageAboveOneSchema,
      ssr_rate: z.nullable(percentageAboveOneSchema),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    const savingsRateInfo: SavingsRateQueryResult = { ssr: [], dsr: [] }

    for (const item of sortedData) {
      const { date, dsr_rate, ssr_rate } = item

      savingsRateInfo.dsr.push({ date, rate: dsr_rate })

      // @note Defaulting to dsr_rate if ssr_rate is null
      savingsRateInfo.ssr.push({ date, rate: ssr_rate ?? dsr_rate })
    }

    return savingsRateInfo
  })
