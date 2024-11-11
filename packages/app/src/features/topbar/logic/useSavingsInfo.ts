import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { SavingsInfoQueryResults } from '@/features/navbar/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

export function useSavingsInfo(): SavingsInfoQueryResults | undefined {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const { savingsDaiInfoQuery, savingsUsdsInfoQuery } = getChainConfigEntry(chainId).savings ?? {}

  function getSavingsInfoQuery(): SavingsInfoQuery | undefined {
    if (savingsUsdsInfoQuery) return savingsUsdsInfoQuery
    if (savingsDaiInfoQuery) return savingsDaiInfoQuery
    return undefined
  }

  const savingsInfoQueryOptions = getSavingsInfoQuery()

  const queryResult = useQuery(
    savingsInfoQueryOptions
      ? savingsInfoQueryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['unsupported-savings-info'], queryFn: skipToken },
  )

  return savingsInfoQueryOptions ? queryResult : undefined
}
