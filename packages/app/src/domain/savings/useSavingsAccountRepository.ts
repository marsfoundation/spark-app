import { getChainConfigEntry } from '@/config/chain'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SavingsAccount, SavingsAccountRepository } from '../savings-converters/types'
import { useTokenRepositoryForFeature } from '../token-repository/useTokenRepositoryForFeature'

export interface UseSavingsAccountRepositoryParams {
  chainId: number
  timestamp?: number
}

export function useSavingsAccountRepository({
  chainId,
  timestamp: _timestamp,
}: UseSavingsAccountRepositoryParams): SavingsAccountRepository {
  const wagmiConfig = useConfig()
  const { timestamp: defaultTimestamp } = useTimestamp()
  const timestamp = _timestamp ?? defaultTimestamp
  const { savings } = getChainConfigEntry(chainId)
  const { tokenRepository } = useTokenRepositoryForFeature({ chainId, featureGroup: 'savings' })
  const fetchConverterQueries = savings?.accounts.map(({ fetchConverterQuery }) => fetchConverterQuery) ?? []

  const converterQueries = useSuspenseQueries({
    queries: fetchConverterQueries.map((query) => ({
      ...query({
        wagmiConfig,
        chainId,
        timestamp,
      }),
    })),
  })

  const accounts: SavingsAccount[] = converterQueries
    .map(
      ({ data }, index) =>
        data && {
          converter: data,
          savingsToken: tokenRepository.findOneTokenBySymbol(savings!.accounts[index]!.savingsToken),
          underlyingToken: tokenRepository.findOneTokenBySymbol(savings!.accounts[index]!.underlyingToken),
        },
    )
    .filter(Boolean)

  return new SavingsAccountRepository(accounts)
}
