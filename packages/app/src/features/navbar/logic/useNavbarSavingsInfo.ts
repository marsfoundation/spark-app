import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { SavingsInfoQueryResults } from '../types'

export function useNavbarSavingsInfo(): SavingsInfoQueryResults | undefined {
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
      : { queryKey: ['navbar-unsupported-savings-info'], queryFn: skipToken },
  )

  return savingsInfoQueryOptions ? queryResult : undefined
}
