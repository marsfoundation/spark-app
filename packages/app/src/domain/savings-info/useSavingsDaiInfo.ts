import { getChainConfigEntry } from '@/config/chain'
import { assert } from '@/utils/assert'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { useTokens } from '../wallet/useTokens/useTokens'
import { SavingsInfoWithBalance } from './types'

export type UseSavingsDaiInfoResult = SuspenseQueryWith<{
  savingsDaiInfo: SavingsInfoWithBalance | null
}>

export function useSavingsDaiInfo(): UseSavingsDaiInfoResult {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const chainConfig = getChainConfigEntry(chainId)

  const queryOptions = chainConfig.savingsDaiInfoQuery
  const { tokens } = useTokens({ tokens: getChainConfigEntry(chainId).extraTokens })
  const sDaiWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sDaiSymbol)

  assert(
    queryOptions ? sDaiWithBalance : true,
    'sDai token with balance must be defined when querying for savings dai info',
  )

  const result = useSuspenseQuery(
    queryOptions
      ? queryOptions({ wagmiConfig, chainId, timestamp })
      : { queryKey: ['savings-info-unsupported'], queryFn: () => null },
  )

  return {
    ...result,
    savingsDaiInfo: result.data && { ...result.data, savingsTokenWithBalance: sDaiWithBalance! },
  }
}
