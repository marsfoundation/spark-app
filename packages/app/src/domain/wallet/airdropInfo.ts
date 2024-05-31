import { queryOptions, skipToken } from '@tanstack/react-query'
import { z } from 'zod'

import { blockAnaliticaApiUrl } from '@/config/consts'
import { CheckedAddress } from '../types/CheckedAddress'
import { NormalizedUnitNumber } from '../types/NumericValues'

const airdropInfoResponseSchema = z
  .object({
    token_reward_total: z.string(),
  })
  .transform((o) => ({
    tokenReward: NormalizedUnitNumber(o.token_reward_total),
  }))
  // @note: Api is returning empty object for addresses without airdrop
  .or(z.object({}).transform(() => ({ tokenReward: NormalizedUnitNumber(0) })))

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
