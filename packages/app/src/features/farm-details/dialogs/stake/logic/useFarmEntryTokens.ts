import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { sortByUsdValueWithUsdsPriority } from './sortByUsdValueWithUsdsPriority'

export interface UseFarmEntryTokensResult {
  tokensInfo: TokensInfo
  entryTokens: TokenWithBalance[]
}

export function useFarmEntryTokens(farm: Farm): UseFarmEntryTokensResult {
  const chainConfig = useChainConfigEntry()
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens })

  const entryTokensUnsorted = farm.entryAssetsGroup.assets.map((symbol) =>
    tokensInfo.findOneTokenWithBalanceBySymbol(symbol),
  )

  const entryTokens = sortByUsdValueWithUsdsPriority(entryTokensUnsorted, tokensInfo)

  return {
    tokensInfo,
    entryTokens,
  }
}
