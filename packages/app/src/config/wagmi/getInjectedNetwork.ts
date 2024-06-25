import { z } from 'zod'
import { SupportedChainId } from '../../domain/types/SupportedChainId'

const injectedNetworkSchema = z.object({
  chainId: z.string().transform((value) => SupportedChainId(value)),
  rpc: z.string().url(),
})

export type InjectedNetwork = z.infer<typeof injectedNetworkSchema>

export function getInjectedNetwork(): InjectedNetwork | undefined {
  const searchParams = new URLSearchParams(window.location.search)
  const chainId = searchParams.get('chainId')
  const rpc = searchParams.get('rpc')

  const result = injectedNetworkSchema.safeParse({ chainId, rpc })

  if (!result.success) {
    return undefined
  }

  return {
    chainId: result.data.chainId,
    rpc: result.data.rpc,
  }
}
