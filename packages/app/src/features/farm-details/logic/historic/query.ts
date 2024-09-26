import { infoSkyApiUrl } from '@/config/consts'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export interface FarmHistoricDataParameters {
  chainId: number
  farmAddress: CheckedAddress
  historyCutoff?: Date
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmHistoricDataQueryOptions({ chainId, farmAddress, historyCutoff }: FarmHistoricDataParameters) {
  return queryOptions({
    queryKey: ['farm-historic-data', chainId, farmAddress],
    queryFn: async () => {
      const res = await fetch(`${infoSkyApiUrl}/farms/${farmAddress.toLowerCase()}/historic/`)
      if (!res.ok) {
        throw new Error(`Failed to fetch farm data: ${res.statusText}`)
      }

      const data = historicDataResponseSchema.parse(await res.json())

      if (historyCutoff) {
        return data.filter((result) => result.date >= historyCutoff)
      }

      return data
    },
  })
}

const historicDataResponseSchema = z
  .object({
    results: z.array(
      z.object({
        date: z.string().transform((value) => new Date(value)),
        apr: z.string().transform((value) => Percentage(value, true)),
      }),
    ),
  })
  .transform((value) => value.results)
