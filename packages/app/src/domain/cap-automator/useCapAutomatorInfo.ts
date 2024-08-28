import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { Token } from '@/domain/types/Token'
import { capAutomatorQueryOptions } from './query'
import { CapAutomatorInfo } from './types'

export interface UseCapAutomatorInfoParams {
  token: Token
  chainId: number
}
export type UseCapAutomatorInfoResult = SuspenseQueryWith<{
  capAutomatorInfo: CapAutomatorInfo
}>

export function useCapAutomatorInfo({ token, chainId }: UseCapAutomatorInfoParams): UseCapAutomatorInfoResult {
  const wagmiConfig = useConfig()

  const res = useSuspenseQuery({
    ...capAutomatorQueryOptions({
      wagmiConfig,
      chainId,
      token,
    }),
  })

  return {
    ...res,
    capAutomatorInfo: res.data,
  }
}
