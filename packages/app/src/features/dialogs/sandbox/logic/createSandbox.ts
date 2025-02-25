import { Address, parseEther, parseUnits } from 'viem'

import { apiUrl } from '@/config/consts'
import { AppConfig } from '@/config/feature-flags'
import { trackEvent } from '@/domain/analytics/mixpanel'
import { createTenderlyFork } from '@/domain/sandbox/createTenderlyFork'
import { tenderlyRpcActions } from '@/domain/tenderly/TenderlyRpcActions'
import { BaseUnitNumber, UnixTime } from '@marsfoundation/common-universal'

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
    Object.entries(opts.mintBalances.tokens).map(async ([_, token]) => {
      const units = BaseUnitNumber(parseUnits(opts.mintBalances.tokenAmt.toString(), token.decimals))
      await tenderlyRpcActions.setTokenBalance(forkUrl, token.address, opts.userAddress, units)
    }),
  )

  trackEvent('sandbox-created')

  return forkUrl
}

/**
 * @returns string concatenated prefix and timestamp
 */
export function getChainIdWithPrefix(prefix: number, timestamp: UnixTime): number {
  return Number.parseInt(prefix.toString() + timestamp.toString())
}
