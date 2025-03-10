import { Address, Chain, parseEther, parseUnits } from 'viem'

import { apiUrl } from '@/config/consts'
import { AppConfig } from '@/config/feature-flags'
import { trackEvent } from '@/domain/analytics/mixpanel'
import { createTenderlyFork } from '@/domain/sandbox/createTenderlyFork'
import { getTenderlyClient } from '@marsfoundation/common-testnets'
import { assert, CheckedAddress, UnixTime } from '@marsfoundation/common-universal'
import { mainnet } from 'wagmi/chains'

export async function createSandbox(opts: {
  originChainId: number
  forkChainId: number
  userAddress: Address
  mintBalances: NonNullable<AppConfig['sandbox']>['mintBalances']
}): Promise<string> {
  const { rpcUrl: forkUrl } = await createTenderlyFork({
    namePrefix: 'sandbox',
    originChainId: opts.originChainId,
    forkChainId: opts.forkChainId,
    apiUrl: `${apiUrl}/sandbox/create`,
  })
  const tenderlyClient = getTenderlyClient(forkUrl, getSandboxChain(opts.originChainId), opts.forkChainId)

  await tenderlyClient.setBalance(opts.userAddress, parseEther(opts.mintBalances.etherAmt.toString()))

  await Promise.all(
    Object.values(opts.mintBalances.tokens).map(async (token) => {
      const units = parseUnits(opts.mintBalances.tokenAmt.toString(), token.decimals)
      await tenderlyClient.setErc20Balance(token.address, opts.userAddress, units)
    }),
  )

  if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'staging') {
    const { setupSparkRewards } = await import('./setupSparkRewards')
    await setupSparkRewards({ forkUrl, account: CheckedAddress(opts.userAddress) })
  }

  trackEvent('sandbox-created')

  return forkUrl
}

/**
 * @returns string concatenated prefix and timestamp
 */
export function getChainIdWithPrefix(prefix: number, timestamp: UnixTime): number {
  return Number.parseInt(prefix.toString() + timestamp.toString())
}

const chainIdToChain: Record<number, Chain> = {
  [mainnet.id]: mainnet,
}
function getSandboxChain(chainId: number): Chain {
  const chain = chainIdToChain[chainId]
  assert(chain, `Invalid chainId ${chainId} in sandbox`)
  return chain
}
