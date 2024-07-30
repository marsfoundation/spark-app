import { getChainConfigEntry } from '@/config/chain'
import { assert } from '@/utils/assert'
import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'
import { useTokens } from '../wallet/useTokens/useTokens'
import { SavingsInfoWithBalance } from './types'

export type UseSavingsNstInfoResult = SuspenseQueryWith<{
  savingsNstInfo: SavingsInfoWithBalance | null
}>

export function useSavingsNstInfo(): UseSavingsNstInfoResult {
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const chainConfig = getChainConfigEntry(chainId)

  const { tokens } = useTokens({ tokens: getChainConfigEntry(chainId).extraTokens })
  const sNSTWithBalance = tokens.find(({ token }) => token.symbol === chainConfig.sDaiSymbol)
  assert(sNSTWithBalance, 'Savings NST token must be defined')

  const queryOptions = chainConfig.savingsNstInfoQuery
  assert(queryOptions, 'Savings NST info query must be defined')

  const result = useSuspenseQuery(
    queryOptions({
      wagmiConfig,
      chainId,
      timestamp,
    }),
  )

  return {
    ...result,
    savingsNstInfo: result.data && { ...result.data, savingsTokenWithBalance: sNSTWithBalance },
  }
}
