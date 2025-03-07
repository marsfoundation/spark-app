import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { useTokenRepositoryForFeature } from '@/domain/token-repository/useTokenRepositoryForFeature'

export interface UseFarmExitTokensResult {
  tokenRepository: TokenRepository
  exitTokens: TokenWithBalance[]
}

export function useFarmExitTokens(farm: Farm): UseFarmExitTokensResult {
  const { sdaiSymbol, susdsSymbol } = useChainConfigEntry()
  const { tokenRepository } = useTokenRepositoryForFeature({ featureGroup: 'farms' })

  const nonSavingExitAssets = farm.entryAssetsGroup.assets.filter(
    (symbol) => symbol !== sdaiSymbol && symbol !== susdsSymbol,
  )

  const exitTokensUnsorted = nonSavingExitAssets.map((symbol) =>
    tokenRepository.findOneTokenWithBalanceBySymbol(symbol),
  )

  const exitTokens = sortByUsdValueWithUsdsPriority(exitTokensUnsorted, tokenRepository)

  return {
    tokenRepository,
    exitTokens,
  }
}
