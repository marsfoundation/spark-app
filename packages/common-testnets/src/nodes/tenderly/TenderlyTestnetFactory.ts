import { assert } from '@marsfoundation/common-universal'
import { HttpClient } from '@marsfoundation/common-universal/http-client'
import { v4 as uuidv4 } from 'uuid'
import { Chain, numberToHex } from 'viem'
import { z } from 'zod'
import { TestnetClient } from '../../TestnetClient.js'
import { CreateNetworkArgs, TestnetCreateResult, TestnetFactory } from '../../TestnetFactory.js'
import { getTenderlyClient } from './TenderlyClient.js'

export class TenderlyTestnetFactory implements TestnetFactory {
  constructor(
    private readonly opts: { apiKey: string; account: string; project: string },
    private readonly httpClient: HttpClient,
  ) {}

  async create(args: CreateNetworkArgs): Promise<TestnetCreateResult> {
    const { id, displayName, originChain, forkChainId, blockNumber } = args
    const uniqueId = uuidv4()

    const response = await this.httpClient.post(
      `https://api.tenderly.co/api/v1/account/${this.opts.account}/project/${this.opts.project}/vnets`,
      {
        slug: `${id}-${uniqueId}`,
        display_name: displayName,
        fork_config: {
          network_id: originChain.id,
          block_number: Number(blockNumber) + 1,
        },
        virtual_network_config: {
          chain_config: {
            chain_id: forkChainId,
          },
        },
        sync_state_config: {
          enabled: false,
          commitment_level: 'latest',
        },
        explorer_page_config: {
          enabled: false,
          verification_visibility: 'bytecode',
        },
      },
      createVnetSchema,
      { 'Content-Type': 'application/json', 'X-Access-Key': this.opts.apiKey },
    )

    const adminRpc = response.rpcs.find((rpc: any) => rpc.name === 'Admin RPC')
    const publicRpc = response.rpcs.find((rpc: any) => rpc.name === 'Public RPC')
    assert(adminRpc && publicRpc, 'Missing admin or public RPC')

    const client = this.createClientFromUrl(adminRpc.url, originChain, forkChainId)
    const legacyClient = client.extend((c) => ({
      async legacySetNextBlockTimestamp(timestamp: bigint) {
        await c.request({
          method: 'evm_setNextBlockTimestamp',
          params: [numberToHex(timestamp)],
        } as any)
      },
    }))

    const block = await client.getBlock({ blockNumber })
    const nextBlockTimestamp = block.timestamp + 2n // to normalize with anvil we need to lowest common timestamp

    await legacyClient.legacySetNextBlockTimestamp(nextBlockTimestamp)

    return {
      client,
      rpcUrl: adminRpc.url,
      publicRpcUrl: publicRpc.url,
      cleanup: () => Promise.resolve(),
    }
  }

  createClientFromUrl(rpcUrl: string, chain: Chain, forkChainId: number): TestnetClient {
    return getTenderlyClient(rpcUrl, chain, forkChainId)
  }
}

const createVnetSchema = z.object({
  rpcs: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    }),
  ),
})
