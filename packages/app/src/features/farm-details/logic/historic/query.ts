import { infoSkyApiUrl } from '@/config/consts'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'
import { queryOptions } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { z } from 'zod'

export interface FarmHistoricDataParameters {
  chainId: number
  farmAddress: CheckedAddress
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmHistoricDataQueryOptions({ chainId, farmAddress }: FarmHistoricDataParameters) {
  return queryOptions({
    queryKey: ['farm-historic-data', chainId, farmAddress],
    queryFn: async () => {
      const res = await fetch(`${infoSkyApiUrl}/farms/${farmAddress.toLowerCase()}/historic/`)
      if (!res.ok) {
        throw new Error(`Failed to fetch farm data: ${res.statusText}`)
      }

      return historicDataResponseSchema.parse(await res.json())
    },
  })
}

const historicDataResponseSchema = z
  .object({
    results: z.array(
      z.object({
        date: z.string().transform((value) => new Date(value)),
        apr: z.string().transform((value) => Percentage(BigNumber(value).div(100), true)),
      }),
    ),
  })
  .transform((value) => value.results)
