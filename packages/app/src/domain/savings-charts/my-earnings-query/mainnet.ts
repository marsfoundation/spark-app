import { infoSkyApiUrl } from '@/config/consts'
import { normalizedUnitNumberSchema } from '@/domain/common/validation'
import { dateSchema } from '@/utils/schemas'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { sort } from 'd3-array'
import { mainnet } from 'wagmi/chains'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function myEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    queryKey: ['my-earnings', mainnet.id, wallet] as QueryKey,
    queryFn: async () => {
      const res = await fetch(`${infoSkyApiUrl}/savings-rate/wallets/${wallet.toLowerCase()}/?days_ago=9999`)

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
      sdai_balance: normalizedUnitNumberSchema.optional(),
      susds_balance: normalizedUnitNumberSchema.optional(),
      susdc_balance: normalizedUnitNumberSchema.optional(),
    }),
  )
  .transform((data) => {
    const sortedData = sort(data, (a, b) => a.datetime.getTime() - b.datetime.getTime())

    return sortedData.map((item) => ({
      date: item.datetime,
      sdaiBalance: item.sdai_balance ?? NormalizedUnitNumber(0),
      susdsBalance: item.susds_balance ?? NormalizedUnitNumber(0),
      susdcBalance: item.susdc_balance ?? NormalizedUnitNumber(0),
    }))
  })

type MyEarningsDataResponseSchema = z.infer<typeof myEarningsDataResponseSchema>

export type MyEarningsResult = { date: Date; balance: NormalizedUnitNumber }[]

function sdaiSelectQuery(data: MyEarningsDataResponseSchema): MyEarningsResult {
  return data.map(({ date, sdaiBalance }) => ({ date, balance: sdaiBalance ?? NormalizedUnitNumber(0) }))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSdaiMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    ...myEarningsQueryOptions(wallet),
    select: sdaiSelectQuery,
  })
}

function susdsSelectQuery(data: MyEarningsDataResponseSchema): MyEarningsResult {
  return data.map(({ date, susdsBalance }) => ({ date, balance: susdsBalance ?? NormalizedUnitNumber(0) }))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSusdsMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    ...myEarningsQueryOptions(wallet),
    select: susdsSelectQuery,
  })
}

function mainnetSusdcSelectQuery(data: MyEarningsDataResponseSchema): MyEarningsResult {
  return data.map(({ date, susdcBalance }) => ({ date, balance: susdcBalance ?? NormalizedUnitNumber(0) }))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mainnetSusdcMyEarningsQueryOptions(wallet: CheckedAddress) {
  return queryOptions({
    ...myEarningsQueryOptions(wallet),
    select: mainnetSusdcSelectQuery,
  })
}
