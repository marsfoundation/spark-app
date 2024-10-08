import { infoSkyApiUrl } from '@/config/consts'
import { normalizedUnitNumberSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { queryOptions, skipToken } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { Address } from 'viem'
import { z } from 'zod'

interface MyEarningsQueryParams {
  chainId: number
  address?: Address
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function myEarningsQueryOptions({ address, chainId }: MyEarningsQueryParams) {
  return queryOptions({
    queryKey: myEarningsInfoQueryKey({ address, chainId }),
    queryFn: address
      ? async () => {
          const res = await fetch(`${infoSkyApiUrl}/savings-rate/wallets/${address.toLowerCase()}/?days_ago=9999`)

          if (!res.ok) {
            throw new Error(`Failed to fetch my earnings data: ${res.statusText}`)
          }

          const data = myEarningsDataResponseSchema.parse(await res.json())

          return data
        }
      : skipToken,
  })
}

export function myEarningsInfoQueryKey({ chainId, address }: Omit<MyEarningsQueryParams, 'staleTime'>): unknown[] {
  return ['my-earnings', chainId, address]
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const myEarningsDataResponseSchema = z
  .array(
    z.object({
      // @note blockanalitica data seems to be off by 1 day
      date: dateSchema.transform((value) => new Date(value.getTime() + MS_PER_DAY)),
      balance: normalizedUnitNumberSchema,
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    return sortedData
  })
