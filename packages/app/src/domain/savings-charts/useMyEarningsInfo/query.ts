import { infoSkyApiUrl } from '@/config/consts'
import { normalizedUnitNumberSchema } from '@/domain/common/validation'
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

const myEarningsDataResponseSchema = z
  .array(
    z.object({
      // @note: response balance is a sum of sdai and usds balance, but we display chart only when user has only one token. Thus, we can treat this sum as a single token balance.
      date: z.string().transform((value) => new Date(value)),
      balance: normalizedUnitNumberSchema,
      sdai_balance: normalizedUnitNumberSchema,
      susds_balance: normalizedUnitNumberSchema,
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    return sortedData.map((item) => ({
      date: item.date,
      balance: item.balance,
      susds: item.susds_balance,
      sdai: item.sdai_balance
    }))
  })
