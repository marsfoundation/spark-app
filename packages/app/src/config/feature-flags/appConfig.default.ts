import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TOKENS_ON_FORK } from '@/test/e2e/constants'
import { mainnet } from 'viem/chains'
import { AppConfig } from '.'
import { clientEnv } from './clientEnv'

export function getDefaultAppConfig(): AppConfig {
  return {
    sandbox: featureFlag('VITE_FEATURE_SANDBOX') && {
      originChainId: mainnet.id,
      chainName: 'Sandbox Mode',

      mintBalances: {
        etherAmt: NormalizedUnitNumber(10_000),
        tokenAmt: NormalizedUnitNumber(10_000),
        tokens: TOKENS_ON_FORK[mainnet.id],
      },
    },
  }
}

/**
 * @note: do not use outside this file because it will break dead code elimination
 */
function featureFlag(key: string): true | undefined {
  return clientEnv.boolean(key) || undefined
}
