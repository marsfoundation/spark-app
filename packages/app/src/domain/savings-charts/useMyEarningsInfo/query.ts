import { infoSkyApiUrl } from '@/config/consts'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import { queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { Address } from 'viem'
import { z } from 'zod'
import { MyEarningsInfoItem } from './types'

interface MyEarningsQueryParams {
  address?: Address
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function myEarningsQueryOptions({ address, chainId }: MyEarningsQueryParams) {
  return queryOptions<MyEarningsInfoItem[]>({
    queryKey: myEarningsInfoQueryKey({ address, chainId }),
    queryFn: async () => {
      assert(address, 'Address is required')

      const res = await fetch(`${infoSkyApiUrl}/savings-rate/wallets/${address.toLowerCase()}/?days_ago=9999`)

      if (!res.ok) {
        throw new Error(`Failed to fetch my earnings data: ${res.statusText}`)
      }

      const data = myEarningsDataResponseSchema.parse(await res.json())

      return data
    },
  })
}

export function myEarningsInfoQueryKey({
  chainId,
  address,
}: Omit<MyEarningsQueryParams, 'timeframe' | 'currentTimestamp'>): unknown[] {
  return ['my-earnings', chainId, address]
}

const myEarningsDataResponseSchema = z
  .array(
    z.object({
      // balance is sum of sdai_balance and susds_balance but since we display it separately we can use balance
      date: z.string().transform((value) => new Date(value)),
      balance: z.string().transform((value) => NormalizedUnitNumber(value)),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())

    return sortedData.map((item) => ({
      date: item.date,
      balance: item.balance,
    }))
  })
