import { createTenderlyFork } from '@/domain/sandbox/createTenderlyFork'
import { solidFetch } from '@/utils/solidFetch'
import { CreateForkArgs, ITestForkService } from './ITestForkService'

export class TestTenderlyForkService implements ITestForkService {
  private readonly baseUrl = 'https://api.tenderly.co/api/v1'

  constructor(private readonly opts: { apiKey: string; tenderlyAccount: string; tenderlyProject: string }) {}

  private getProjectUrl(): string {
    return `${this.baseUrl}/account/${this.opts.tenderlyAccount}/project/${this.opts.tenderlyProject}`
  }

  async createFork({ originChainId, forkChainId, blockNumber }: CreateForkArgs): Promise<string> {
    const { rpcUrl } = await createTenderlyFork({
      apiUrl: `${this.getProjectUrl()}/fork`,
      originChainId,
      forkChainId,
      namePrefix: 'test-e2e',
      blockNumber,
      headers: {
        'X-Access-Key': this.opts.apiKey,
      },
    })

    return rpcUrl
  }

  async deleteFork(forkUrl: string): Promise<void> {
    const forkId = forkUrl.split('/').pop()
    await solidFetch(`${this.getProjectUrl()}/fork/${forkId}`, {
      method: 'delete',
      headers: {
        'X-Access-Key': this.opts.apiKey,
      },
    })
  }
}
