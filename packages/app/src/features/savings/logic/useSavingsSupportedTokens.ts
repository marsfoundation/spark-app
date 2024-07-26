import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { useTokens } from '@/domain/wallet/useTokens/useTokens'
import { assert } from '@/utils/assert'
import { useChainId } from 'wagmi'

export interface UseSavingsSupportedTokensResult {
  savingsEntryTokens: TokenWithBalance[]
  sDaiWithBalance: TokenWithBalance
}

export function useSavingsSupportedTokens(): UseSavingsSupportedTokensResult {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)

  const savingsTokensConfigs = chainConfig.extraTokens.filter((t) => chainConfig.savingsTokens.includes(t.symbol))
  const { tokens } = useTokens({ tokens: savingsTokensConfigs })

  const savingsEntryTokens = tokens.filter(({ token }) => chainConfig.savingsNativeRouteTokens.includes(token.symbol))
  const sDaiWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sDaiSymbol)
  assert(sDaiWithBalance, 'sDaiWithBalance should be defined')

  return {
    savingsEntryTokens,
    sDaiWithBalance,
  }
}
