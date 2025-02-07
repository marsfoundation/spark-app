import { getChainConfigEntry } from '@/config/chain'
import { SavingsConverterQuery } from '@/config/chain/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SavingsConverterQueryResults } from '@/features/topbar/types'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

export function useSavingsConverter(): SavingsConverterQueryResults | undefined {
  const chainId = useChainId()
  const wagmiConfig = useConfig()

  const { accounts } = getChainConfigEntry(chainId).savings ?? {}

  function getSavingsConverterQuery(): SavingsConverterQuery | undefined {
    for (const tokenSymbol of [TokenSymbol('sUSDS'), TokenSymbol('sDAI')]) {
      return accounts?.find(({ savingsToken }) => savingsToken === tokenSymbol)?.fetchConverterQuery
    }
    return undefined
  }

  const savingsConverterQuery = getSavingsConverterQuery()

  const queryResult = useQuery(
    savingsConverterQuery
      ? savingsConverterQuery({ wagmiConfig, chainId })
      : { queryKey: ['unsupported-savings-converter'], queryFn: skipToken },
  )

  return savingsConverterQuery ? queryResult : undefined
}
