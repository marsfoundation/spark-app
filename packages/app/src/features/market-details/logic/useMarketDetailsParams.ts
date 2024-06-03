import { useChains } from 'wagmi'
import { z } from 'zod'

import { checkedAddressSchema } from '@/domain/common/validation'
import { NotFoundError } from '@/domain/errors/not-found'
import { useValidatedParams } from '@/utils/useValidatedParams'

const marketDetailsUrlSchema = z.object({
  chainId: z.coerce.number(),
  asset: checkedAddressSchema,
})

export function useMarketDetailsParams(): z.infer<typeof marketDetailsUrlSchema> {
  const params = useValidatedParams(marketDetailsUrlSchema)
  const configuredChains = useChains()
  if (!configuredChains.some((chain) => chain.id === params.chainId)) {
    throw new NotFoundError()
  }

  return params
}
