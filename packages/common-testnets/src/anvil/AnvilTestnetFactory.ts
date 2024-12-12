import { assert } from '@marsfoundation/common-universal'
import { TestnetClient } from '../TestnetClient'
import { CreateNetworkArgs, TestnetCreateResult, TestnetFactory } from '../TestnetFactory'

import { createAnvil } from '@viem/anvil'
import { getAnvilClient } from './AnvilClient'
import { createPublicClient, http } from 'viem'
import getPort from 'get-port'

export class AnvilTestnetFactory implements TestnetFactory {
  constructor(private readonly opts: { alchemyApiKey: string }) {}

  async create(args: CreateNetworkArgs): Promise<TestnetCreateResult> {
    const { originChainId, forkChainId, blockNumber } = args

    const forkUrl = originChainIdToForkUrl(originChainId, this.opts.alchemyApiKey)
    // if forkChainId is specified, anvil requires blockNumber to be specified as well
    const forkBlockNumber = await (async () => {
      if (blockNumber) {
        return blockNumber
      }

      const publicClient = createPublicClient({ transport: http(forkUrl)})
      return publicClient.getBlockNumber()
    })()
    const port = await getPort({ port: 8545 })

    const anvil = createAnvil({
      forkUrl,
      autoImpersonate: true,
      forkBlockNumber,
      forkChainId,
      port,
      gasPrice: 0,
      blockBaseFeePerGas: 0,
    })

    await anvil.start()

    const url = `http://${anvil.host}:${anvil.port}`

    assert(anvil.status === 'listening', `Anvil failed to start: ${anvil.status}`)

    const client = getAnvilClient(url)

    await client.mineBlocks(2n)

    return {
      client,
      cleanup: async () => {
        await anvil.stop()
      },
    }
  }

  createClientFromUrl(rpcUrl: string): TestnetClient {
    return getAnvilClient(rpcUrl)
  }
}

function originChainIdToForkUrl(originChainId: number, alchemyApiKey: string): string {
  switch (originChainId) {
    case 1:
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    case 8453:
      return `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
    default:
      throw new Error(`Unsupported origin chain id: ${originChainId}`)
  }
}

