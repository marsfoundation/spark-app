import { queryOptions, skipToken } from '@tanstack/react-query'
import { z } from 'zod'

import { blockAnaliticaApiUrl } from '@/config/consts'
import { normalizedUnitNumberSchema } from '../common/validation'
import { CheckedAddress } from '../types/CheckedAddress'

const airdropInfoResponseSchema = z
  .object({
    token_reward_total: normalizedUnitNumberSchema,
    token_rate: normalizedUnitNumberSchema,
    timestamp: z.number(),
  })
  .transform((o) => ({
    tokenReward: o.token_reward_total,
    tokenRate: o.token_rate,
    timestamp: o.timestamp,
  }))
  // @note: Api is returning empty object for addresses without airdrop
  .or(z.object({}).transform(() => undefined))

export type AirdropInfoResponse = z.infer<typeof airdropInfoResponseSchema>

const baseUrl = `${blockAnaliticaApiUrl}/airdrop`

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
