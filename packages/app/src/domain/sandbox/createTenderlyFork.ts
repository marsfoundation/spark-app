import { z } from 'zod'

import { randomHexId } from '@/utils/random'
import { solidFetch } from '@marsfoundation/common-universal'

const createForkResponseSchema = z.object({
  simulation_fork: z.object({
    rpc_url: z.string(),
  }),
})

export interface CreateTenderlyForkArgs {
  apiUrl: string
  originChainId: number
  forkChainId: number
  namePrefix: string
  blockNumber?: bigint
  headers?: Record<string, string>
}

export interface CreateTenderlyForkResult {
  rpcUrl: string
}

export async function createTenderlyFork({
  apiUrl,
  originChainId,
  forkChainId,
  namePrefix,
  blockNumber,
  headers,
}: CreateTenderlyForkArgs): Promise<CreateTenderlyForkResult> {
  const response = await solidFetch(apiUrl, {
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      network_id: originChainId,
      block_number: blockNumber ? Number(blockNumber) : undefined,
      chain_config: { chain_id: forkChainId },
      alias: `${namePrefix}_${randomHexId()}`,
    }),
  })

  const data = createForkResponseSchema.parse(await response.json())
  return { rpcUrl: data.simulation_fork.rpc_url }
}
