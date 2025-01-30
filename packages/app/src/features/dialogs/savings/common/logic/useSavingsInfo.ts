import { getChainConfigEntry } from '@/config/chain'
import { SavingsInfoQuery } from '@/config/chain/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useTimestamp } from '@/utils/useTimestamp'
import { raise } from '@marsfoundation/common-universal'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

export function useSavingsInfo({ savingsToken }: { savingsToken: Token }): SavingsInfo {
  const chainId = useChainId()
  const savingsInfoQuery = extractSavingsInfoQuery({ savingsToken, chainId })

  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const result = useSuspenseQuery(savingsInfoQuery({ wagmiConfig, chainId, timestamp }))

  return result.data ?? raise(`Savings info is not found for ${savingsToken.symbol} on chain ${chainId}`)
}

function extractSavingsInfoQuery({
  savingsToken,
  chainId,
}: { savingsToken: Token; chainId: number }): SavingsInfoQuery {
  const savingsConfig = getChainConfigEntry(chainId).savings
  const savingsInfoQuery = (() => {
    if (savingsToken.symbol === TokenSymbol('sDAI')) {
      return savingsConfig?.savingsDaiInfoQuery
    }

    if (savingsToken.symbol === TokenSymbol('sUSDS')) {
      return savingsConfig?.savingsUsdsInfoQuery
    }

    if (savingsToken.symbol === TokenSymbol('sUSDC')) {
      return savingsConfig?.savingsUsdcInfoQuery
    }
  })()

  return savingsInfoQuery ?? raise(`Savings info is not found for ${savingsToken.symbol} on chain ${chainId}`)
}
