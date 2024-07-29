import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { useTokens } from '@/domain/wallet/useTokens/useTokens'
import { assert } from '@/utils/assert'
import { useChainId } from 'wagmi'

export interface UseSavingsTokensResult {
  savingsInputTokens: TokenWithBalance[]
  sDaiWithBalance: TokenWithBalance
}

export function useSavingsTokens(): UseSavingsTokensResult {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)

  const { tokens } = useTokens({ tokens: chainConfig.extraTokens })

  const savingsInputTokens = tokens.filter(({ token }) => chainConfig.savingsInputTokens.includes(token.symbol))
  const sDaiWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sDaiSymbol)
  assert(sDaiWithBalance, 'sDaiWithBalance should be defined')

  return {
    savingsInputTokens,
    sDaiWithBalance,
  }
}
