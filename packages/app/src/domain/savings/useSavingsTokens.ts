import { getChainConfigEntry } from '@/config/chain'
import { TokenWithBalance } from '@/domain/common/types'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'

export interface UseSavingsTokensParams {
  chainId: number
}

export interface UseSavingsTokensResult {
  tokensInfo: TokensInfo
  inputTokens: TokenWithBalance[]
  sdaiWithBalance?: TokenWithBalance
  susdsWithBalance?: TokenWithBalance
}

export function useSavingsTokens({ chainId }: UseSavingsTokensParams): UseSavingsTokensResult {
  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  const inputTokens = tokensInfo.filter(({ token }) => Boolean(chainConfig.savings?.inputTokens.includes(token.symbol)))
  const sdaiWithBalance = chainConfig.sdaiSymbol
    ? tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.sdaiSymbol)
    : undefined
  const susdsWithBalance = chainConfig.susdsSymbol
    ? tokensInfo.findOneTokenWithBalanceBySymbol(chainConfig.susdsSymbol)
    : undefined

  return {
    tokensInfo,
    inputTokens,
    sdaiWithBalance,
    susdsWithBalance,
  }
}
