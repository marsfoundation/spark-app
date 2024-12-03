import { normalizedUnitNumberSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { queryOptions, skipToken } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { z } from 'zod'

interface MyEarningsQueryParams {
  chainId: number
  address?: CheckedAddress
  getEarningsApiUrl: ((address: CheckedAddress) => string) | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function myEarningsQueryOptions({ address, chainId, getEarningsApiUrl }: MyEarningsQueryParams) {
  return queryOptions({
    queryKey: myEarningsInfoQueryKey({ address, chainId }),
    queryFn:
      getEarningsApiUrl && address
        ? async () => {
            const res = await fetch(getEarningsApiUrl(address))

            if (!res.ok) {
              throw new Error(`Failed to fetch my earnings data: ${res.statusText}`)
            }

            const data = myEarningsDataResponseSchema.parse(await res.json())

            return data
          }
        : skipToken,
  })
}

export function myEarningsInfoQueryKey({
  chainId,
  address,
}: Omit<MyEarningsQueryParams, 'getEarningsApiUrl'>): unknown[] {
  return ['my-earnings', chainId, address]
}

const myEarningsDataResponseSchema = z
  .array(
    z.object({
      datetime: dateSchema,
      balance: normalizedUnitNumberSchema,
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.datetime.getTime() - b.datetime.getTime())

    return sortedData.map((item) => ({
      date: item.datetime,
      balance: item.balance,
    }))
  })
