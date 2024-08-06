import { solidFetch } from '@/utils/solidFetch'

export interface CreateTenderlyVnetArgs {
  name: string
  displayName?: string
  originChainId: number
  forkChainId: number
  blockNumber?: bigint
}

export interface CloneTenderlyVnetArgs {
  srcContainerId: string
  displayName: string
}

export interface CreateTenderlyVnetResult {
  rpcUrl: string
}

export interface CloneTenderlyVnetResult {
  rpcUrl: string
}

export class TenderlyVnetClient {
  constructor(private readonly opts: { apiKey: string; account: string; project: string }) {}

  async create({
    name,
    displayName,
    originChainId,
    forkChainId,
    blockNumber,
  }: CreateTenderlyVnetArgs): Promise<CreateTenderlyVnetResult> {
    const response = await solidFetch(
      `https://api.tenderly.co/api/v1/account/${this.opts.account}/project/${this.opts.project}/vnets`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'X-Access-Key': this.opts.apiKey },
        body: JSON.stringify({
          slug: name,
          display_name: displayName,
          fork_config: {
            network_id: originChainId,
            block_number: Number(blockNumber),
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
        }),
      },
    )

    const data: any = await response.json()
    return { rpcUrl: data.rpcs[0].url }
  }

  async clone({ srcContainerId, displayName }: CloneTenderlyVnetArgs): Promise<CloneTenderlyVnetResult> {
    const response = await solidFetch(
      `https://api.tenderly.co/api/v1/account/${this.opts.account}/project/${this.opts.project}/testnet/clone`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'X-Access-Key': this.opts.apiKey },
        body: JSON.stringify({
          srcContainerId,
          dstContainerDisplayName: displayName,
        }),
      },
    )

    const data: any = await response.json()

    const adminRpcUrl = data.connectivityConfig.endpoints.find(
      (endpoint: any) => endpoint.displayName === 'Admin RPC',
    )?.uri

    await waitFor(async () => {
      const status = await this.getContainerStatus(data.id)
      return status.toLowerCase() === 'running'
    })

    return { rpcUrl: adminRpcUrl }
  }

  private async getContainerStatus(containerId: string): Promise<string> {
    const response = await solidFetch(
      `https://api.tenderly.co/api/v1/account/${this.opts.account}/project/${this.opts.project}/testnet/container/${containerId}`,
      {
        headers: { 'X-Access-Key': this.opts.apiKey },
      },
    )

    const data: any = await response.json()
    return data.container.status
  }
}

async function waitFor(predicate: () => Promise<boolean>): Promise<void> {
  const MAX_ATTEMPTS = 100
  const DELAY_MS = 300

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (await predicate()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  }

  throw new Error('Timeout: Predicate did not become true within the allotted time')
}
