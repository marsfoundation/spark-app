import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

export function useSavingsInfos() {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const { savings, extraTokens } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens })
  const accounts: { savingsInfoQuery: SavingsInfoQuery; savingsToken?: Token }[] = []

  if (savings?.savingsDaiInfoQuery) {
    accounts.push({
      savingsInfoQuery: savings.savingsDaiInfoQuery,
      savingsToken: tokensInfo.findTokenBySymbol(TokenSymbol('sDAI')),
    })
  }

  if (savings?.savingsUsdsInfoQuery) {
    accounts.push({
      savingsInfoQuery: savings.savingsUsdsInfoQuery,
      savingsToken: tokensInfo.findTokenBySymbol(TokenSymbol('sUSDS')),
    })
  }

  if (savings?.savingsUsdcInfoQuery) {
    accounts.push({
      savingsInfoQuery: savings.savingsUsdcInfoQuery,
      savingsToken: tokensInfo.findTokenBySymbol(TokenSymbol('sUSDC')),
    })
  }

  const results = useSuspenseQueries({
    queries: accounts.map(({ savingsInfoQuery }) => ({
      ...savingsInfoQuery({
        wagmiConfig,
        chainId,
        timestamp,
      }),
    })),
  })

  const savingsInfos: { savingsInfo: SavingsInfo; savingsToken: Token }[] = results
    .map((result, index) => ({
      savingsInfo: result.data,
      savingsToken: accounts[index]!.savingsToken,
    }))
    .filter(({ savingsInfo, savingsToken }) => savingsInfo !== null && savingsToken !== undefined) as any[]

  return savingsInfos
}
