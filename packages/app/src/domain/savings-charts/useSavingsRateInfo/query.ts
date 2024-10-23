import { percentageAboveOneSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { queryOptions, skipToken } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { z } from 'zod'
import { SavingsRateInfo } from './types'

interface SavingsRateQueryParams {
  chainId: number
  savingsRateApiUrl: string | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function savingsRateQueryOptions({ chainId, savingsRateApiUrl }: SavingsRateQueryParams) {
  return queryOptions<SavingsRateInfo>({
    queryKey: savingsRateInfoQueryKey({ chainId }),
    queryFn: savingsRateApiUrl
      ? async () => {
          const res = await fetch(savingsRateApiUrl)

          if (!res.ok) {
            throw new Error(`Failed to fetch savings rate data: ${res.statusText}`)
          }

          const data = savingsRateDataResponseSchema.parse(await res.json())

          return data
        }
      : skipToken,
  })
}

export function savingsRateInfoQueryKey({ chainId }: Omit<SavingsRateQueryParams, 'savingsRateApiUrl'>): unknown[] {
  return ['savings-rate', chainId]
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

    const savingsRateInfo: SavingsRateInfo = { ssr: [], dsr: [] }

    for (const item of sortedData) {
      const { date, dsr_rate, ssr_rate } = item

      savingsRateInfo.dsr.push({ date, rate: dsr_rate })

      // @note Defaulting to dsr_rate if ssr_rate is null
      savingsRateInfo.ssr.push({ date, rate: ssr_rate ?? dsr_rate })
    }

    return savingsRateInfo
  })
