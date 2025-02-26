import { Address, parseEther, parseUnits } from 'viem'

import { apiUrl } from '@/config/consts'
import { AppConfig } from '@/config/feature-flags'
import { trackEvent } from '@/domain/analytics/mixpanel'
import { createTenderlyFork } from '@/domain/sandbox/createTenderlyFork'
import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { BaseUnitNumber, CheckedAddress, UnixTime } from '@marsfoundation/common-universal'
import { setupSparkRewards } from './setupSparkRewards'

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

  await tenderlyRpcActions.setBalance(
    forkUrl,
    opts.userAddress,
    BaseUnitNumber(parseEther(opts.mintBalances.etherAmt.toString())),
  )

  await Promise.all(
    Object.values(opts.mintBalances.tokens).map(async (token) => {
      const units = BaseUnitNumber(parseUnits(opts.mintBalances.tokenAmt.toString(), token.decimals))
      await tenderlyRpcActions.setTokenBalance(forkUrl, token.address, opts.userAddress, units)
    }),
  )

  if (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'staging') {
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
