import { randomHexId } from '@/utils/random'
import { CreateForkArgs, ITestTenderlyService } from './ITestTenderlyService'
import { TenderlyVnetClient } from './TenderlyVnetClient'

export class TestTenderlyVnetService implements ITestTenderlyService {
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

  async deleteFork(_forkUrl: string): Promise<void> {
    // doesn't support deleting vnets yet
  }
}
