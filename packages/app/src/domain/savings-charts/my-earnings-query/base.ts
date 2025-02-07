import { infoSkyApiUrl } from '@/config/consts'
import { normalizedUnitNumberSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { base } from 'wagmi/chains'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function baseMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    queryKey: ['my-earnings', base.id, wallet] as QueryKey,
    queryFn: async () => {
      const res = await fetch(
        `${infoSkyApiUrl}/savings-rate/wallets/${wallet.toLowerCase()}/?days_ago=9999&chainId=${base.id}`,
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch my earnings data: ${res.statusText}`)
      }

      const data = myEarningsDataResponseSchema.parse(await res.json())

      return data
    },
  })
}

const myEarningsDataResponseSchema = z
  .array(
    z.object({
      datetime: dateSchema,
      balance: normalizedUnitNumberSchema.optional(),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.datetime.getTime() - b.datetime.getTime())

    return sortedData.map((item) => ({
      date: item.datetime,
      balance: item.balance ?? NormalizedUnitNumber(0),
    }))
  })
