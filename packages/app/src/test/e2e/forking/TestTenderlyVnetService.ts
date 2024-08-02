import { randomHexId } from '@/utils/random'
import { TenderlyVnetClient } from '../../../domain/tenderly/TenderlyVnetClient'
import { CreateForkArgs, ITestForkService } from './ITestForkService'
import { z } from 'zod'
import { processEnv } from '../processEnv'

export class TestTenderlyVnetService implements ITestForkService {
  private readonly client: TenderlyVnetClient

  constructor(opts: { apiKey: string; account: string; project: string }) {
    this.client = new TenderlyVnetClient(opts)
  }

  async createFork({ originChainId, forkChainId, blockNumber }: CreateForkArgs): Promise<string> {
    const { rpcUrl } = await this.client.create({
      forkChainId,
      originChainId,
      blockNumber,
      name: `test-e2e-${randomHexId()}`,
    })

    return rpcUrl
  }

  async cloneNSTFork(): Promise<string> {
    const NST_DEVNET_CONTAINER_ID = processEnv('TENDERLY_NST_DEVNET_CONTAINER_ID')

    const { rpcUrl } = await this.client.clone({
      displayName: `nst-devnet-clonse-test-e2e-${randomHexId()}`,
      srcContainerId: NST_DEVNET_CONTAINER_ID,
    })

    return rpcUrl
  }

  async deleteFork(_forkUrl: string): Promise<void> {
    // doesn't support deleting vnets yet
  }
}
