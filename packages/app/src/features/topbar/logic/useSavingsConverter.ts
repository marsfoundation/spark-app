import { getChainConfigEntry } from '@/config/chain'
import { SavingsConverterQuery } from '@/config/chain/types'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { SavingsConverterQueryResults } from '@/features/topbar/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

export function useSavingsConverter(): SavingsConverterQueryResults | undefined {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const { accounts } = getChainConfigEntry(chainId).savings ?? {}

  function getSavingsConverterQuery(): SavingsConverterQuery | undefined {
    const susdsAccount = accounts?.find(({ savingsToken }) => savingsToken === TokenSymbol('sUSDS'))
    if (susdsAccount) {
      return susdsAccount.fetchConverterQuery
    }
    const sdaiAccount = accounts?.find(({ savingsToken }) => savingsToken === TokenSymbol('sDAI'))
    if (sdaiAccount) {
      return sdaiAccount.fetchConverterQuery
    }
    return undefined
  }

  const savingsConverterQuery = getSavingsConverterQuery()

  const queryResult = useQuery(
    savingsConverterQuery
      ? savingsConverterQuery({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['unsupported-savings-converter'], queryFn: skipToken },
  )

  return savingsConverterQuery ? queryResult : undefined
}
