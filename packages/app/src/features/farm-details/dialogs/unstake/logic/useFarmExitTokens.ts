import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { sortByUsdValueWithUsdsPriority } from './sortByUsdValueWithUsdsPriority'

export interface UseFarmExitTokensResult {
  tokensInfo: TokensInfo
  exitTokens: TokenWithBalance[]
}

export function useFarmExitTokens(farm: Farm): UseFarmExitTokensResult {
  const { extraTokens, sDaiSymbol, sUSDSSymbol } = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })

  const nonSavingAssets = farm.entryAssetsGroup.assets.filter(
    (symbol) => symbol !== sDaiSymbol && symbol !== sUSDSSymbol,
  )

  const entryTokensUnsorted = nonSavingAssets.map((symbol) => tokensInfo.findOneTokenWithBalanceBySymbol(symbol))

  const exitTokens = sortByUsdValueWithUsdsPriority(entryTokensUnsorted, tokensInfo)

  return {
    tokensInfo,
    exitTokens,
  }
}
