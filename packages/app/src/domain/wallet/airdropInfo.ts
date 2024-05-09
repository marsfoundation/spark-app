import { queryOptions, skipToken } from '@tanstack/react-query'
import { z } from 'zod'

import { CheckedAddress } from '../types/CheckedAddress'

const airdropInfoResponseSchema = z.object({
  tokenReward: z.string(),
})
export type AirdropInfoResponse = z.infer<typeof airdropInfoResponseSchema>

const baseUrl = 'https://spark-api.blockanalitica.com/api/airdrop'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function airdropInfo(account?: CheckedAddress) {
  return queryOptions<AirdropInfoResponse>({
    queryKey: ['airdropInfo', account],
    queryFn: account
      ? async () => {
          const response = await fetch(`${baseUrl}/${account}/`)
          if (!response.ok) {
            throw new Error('Error fetching airdrop info')
          }
          const result = await response.json()

          return airdropInfoResponseSchema.parse(result)
        }
      : skipToken,
  })
}
