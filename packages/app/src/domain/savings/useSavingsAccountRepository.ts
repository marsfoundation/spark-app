import { getChainConfigEntry } from '@/config/chain'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SavingsAccount, SavingsAccountRepository } from '../savings-converters/types'
import { useTokensInfo } from '../wallet/useTokens/useTokensInfo'

export interface UseSavingsAccountRepositoryParams {
  chainId: number
}

export function useSavingsAccountRepository({ chainId }: UseSavingsAccountRepositoryParams): SavingsAccountRepository {
  const wagmiConfig = useConfig()
  const { savings, extraTokens } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const fetchConverterQueries = savings?.accounts.map(({ fetchConverterQuery }) => fetchConverterQuery) ?? []

  const converterQueries = useSuspenseQueries({
    queries: fetchConverterQueries.map((query) => ({
      ...query({
        wagmiConfig,
        chainId,
      }),
    })),
  })

  const accounts: SavingsAccount[] = converterQueries
    .map(
      ({ data }, index) =>
        data && {
          converter: data,
          savingsToken: tokensInfo.findOneTokenBySymbol(savings!.accounts[index]!.savingsToken),
          underlyingToken: tokensInfo.findOneTokenBySymbol(savings!.accounts[index]!.underlyingToken),
        },
    )
    .filter(Boolean)

  return new SavingsAccountRepository(accounts)
}
