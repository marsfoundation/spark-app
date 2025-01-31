import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'
import { TokensInfo } from '../wallet/useTokens/TokenInfo'
import { useTokensInfo } from '../wallet/useTokens/useTokensInfo'
import { SavingsAccount, SavingsAccountRepository } from './types'

export interface UseSavingsAccountRepositoryParams {
  chainId: number
}

export function useSavingsAccountRepository({ chainId }: UseSavingsAccountRepositoryParams): SavingsAccountRepository {
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const { savings, extraTokens } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const fetchConverterQueries: SavingsInfoQuery[] = []
  const savingsTokens: Token[] = []

  if (savings?.savingsDaiInfoQuery) {
    fetchConverterQueries.push(savings.savingsDaiInfoQuery)
    savingsTokens.push(tokensInfo.findOneTokenBySymbol(TokenSymbol('sDAI')))
  }
  if (savings?.savingsUsdsInfoQuery) {
    fetchConverterQueries.push(savings.savingsUsdsInfoQuery)
    savingsTokens.push(tokensInfo.findOneTokenBySymbol(TokenSymbol('sUSDS')))
  }
  if (savings?.savingsUsdcInfoQuery) {
    fetchConverterQueries.push(savings.savingsUsdcInfoQuery)
    savingsTokens.push(tokensInfo.findOneTokenBySymbol(TokenSymbol('sUSDC')))
  }

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
          savingsToken: savingsTokens[index]!,
          underlyingToken: savingsToUnderlyingToken(tokensInfo, savingsTokens[index]!),
        },
    )
    .filter(Boolean)

  return new SavingsAccountRepository(accounts)
}

function savingsToUnderlyingToken(tokensInfo: TokensInfo, savingsToken: Token): Token {
  const underlyingTokenSymbol = (() => {
    switch (savingsToken.symbol) {
      case TokenSymbol('sUSDS'):
        return TokenSymbol('USDS')
      case TokenSymbol('sDAI'):
        return TokenSymbol('DAI')
      case TokenSymbol('sUSDC'):
        return TokenSymbol('USDC')
      default:
        throw new Error(`Savings token ${savingsToken.symbol} is not supported`)
    }
  })()
  return tokensInfo.findOneTokenBySymbol(underlyingTokenSymbol)
}
