import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { useTokens } from '@/domain/wallet/useTokens/useTokens'
import { useChainId } from 'wagmi'

export type UseSavingsInputTokensResult = {
  inputTokens: TokenWithBalance[]
}

export function useSavingsTokens(): TokenWithBalance[] {
  const chainId = useChainId()
  const chainConfig = getChainConfigEntry(chainId)
  const { tokens } = useTokens({ tokens: chainConfig.extraTokens })

  return tokens.filter(({ token }) => chainConfig.savingsInputTokens.includes(token.symbol))
}
