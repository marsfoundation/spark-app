import { infoSkyApiUrl } from '@/config/consts'
import { normalizedNumberSchema } from '@/domain/common/validation'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export interface GeneralStatsQueryResult {
  tvl: number
  users: number
  getLiquidity: (accountSavingsToken: Token) => number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function generalStatsQueryOptions() {
  return queryOptions<GeneralStatsQueryResult>({
    queryKey: ['savings-general-stats'],
    queryFn: async () => {
      const response = await fetch(`${infoSkyApiUrl}/spark/savings/`)
      if (!response.ok) {
        throw new Error('Error fetching savings general stats')
      }
      const result = await response.json()
      const parsedResult = generalStatsResponseSchema.parse(result)

      return {
        tvl: parsedResult.tvl,
        users: parsedResult.users,
        getLiquidity: (accountSavingsToken: Token) =>
          accountSavingsToken.symbol === TokenSymbol('sUSDC')
            ? parsedResult.liquidityMap.usdc
            : Number.POSITIVE_INFINITY,
      }
    },
  })
}

const generalStatsResponseSchema = z
  .object({
    savings_tvl: normalizedNumberSchema,
    number_of_wallets: z.number(),
    liquidity: z.object({
      usdc: normalizedNumberSchema,
    }),
  })
  .transform((o) => ({
    tvl: o.savings_tvl,
    users: o.number_of_wallets,
    liquidityMap: o.liquidity,
  }))
