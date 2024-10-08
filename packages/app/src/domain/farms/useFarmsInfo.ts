import { getChainConfigEntry } from '@/config/chain'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { SuspenseQueryWith } from '@/utils/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { FarmsInfo } from './farmsInfo'
import { farmsInfoQueryOptions } from './query'

export interface UseFarmsInfoParams {
  chainId?: number
}

export type UseFarmsInfoResultOnSuccess = SuspenseQueryWith<{
  farmsInfo: FarmsInfo
}>

export function useFarmsInfo(params: UseFarmsInfoParams = {}): UseFarmsInfoResultOnSuccess {
  const wagmiConfig = useConfig()
  const { address: account } = useAccount()
  const _chainId = useChainId()
  const chainId = params.chainId ?? _chainId

  const chainConfig = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: chainConfig.extraTokens, chainId })

  const res = useSuspenseQuery(
    farmsInfoQueryOptions({ farmConfigs: chainConfig.farms, wagmiConfig, tokensInfo, chainId, account }),
  )

  return {
    ...res,
    farmsInfo: res.data,
  }
}
