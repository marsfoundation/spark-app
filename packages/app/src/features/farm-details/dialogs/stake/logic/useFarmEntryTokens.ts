import { sortByUsdValueWithUsdsPriority } from '@/domain/common/sorters'
import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { TokenRepository } from '@/domain/token-repository/TokenRepository'
import { useTokenRepositoryForFeature } from '@/domain/token-repository/useTokenRepositoryForFeature'

export interface UseFarmEntryTokensResult {
  tokenRepository: TokenRepository
  entryTokens: TokenWithBalance[]
}

export function useFarmEntryTokens(farm: Farm): UseFarmEntryTokensResult {
  const { tokenRepository } = useTokenRepositoryForFeature({ featureGroup: 'farms' })

  const entryTokensUnsorted = farm.entryAssetsGroup.assets.map((symbol) =>
    tokenRepository.findOneTokenWithBalanceBySymbol(symbol),
  )

  const entryTokens = sortByUsdValueWithUsdsPriority(entryTokensUnsorted, tokenRepository)

  return {
    tokenRepository,
    entryTokens,
  }
}
