import { useChains } from 'wagmi'
import { z } from 'zod'

import { checkedAddressSchema } from '@/domain/common/validation'
import { NotFoundError } from '@/domain/errors/not-found'
import { useValidatedParams } from '@/utils/useValidatedParams'

const farmDetailsUrlSchema = z.object({
  chainId: z.coerce.number(),
  address: checkedAddressSchema,
})

export function useFarmDetailsParams(): z.infer<typeof farmDetailsUrlSchema> {
  const params = useValidatedParams(farmDetailsUrlSchema)
  const configuredChains = useChains()
  if (!configuredChains.some((chain) => chain.id === params.chainId)) {
    throw new NotFoundError()
  }

  return params
}
