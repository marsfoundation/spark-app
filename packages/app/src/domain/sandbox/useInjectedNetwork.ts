import { z } from 'zod'
import { SupportedChainId } from '../types/SupportedChainId'

const injectedNetworkSchema = z.object({
  chainId: z.string().transform((value) => SupportedChainId(value)),
  rpc: z.string().url(),
})

export interface UseInjectedNetworkResult {
  chainId: SupportedChainId
  rpc: string
}

export function useInjectedNetwork(): UseInjectedNetworkResult | undefined {
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
