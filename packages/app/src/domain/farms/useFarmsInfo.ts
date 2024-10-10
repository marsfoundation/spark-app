import { getChainConfigEntry } from '@/config/chain'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { farmsApiDetailsQueryOptions } from './farmApiDetailsQuery'
import { farmsBlockchainDetailsQueryOptions } from './farmBlockchainDetailsQuery'
import { FarmsInfo } from './farmsInfo'
import { Farm, FarmApiDetails, FarmBlockchainDetails } from './types'

export interface UseFarmsInfoParams {
  chainId?: number
}

export interface UseFarmsInfoResult {
  farmsInfo: FarmsInfo
}

export function useFarmsInfo(params: UseFarmsInfoParams = {}): UseFarmsInfoResult {
  const wagmiConfig = useConfig()
  const { address: account } = useAccount()
  const _chainId = useChainId()
  const chainId = params.chainId ?? _chainId

  const { farms: farmConfigs, extraTokens } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })

  const farmsApiDetailsResult = useQuery(farmsApiDetailsQueryOptions({ farmConfigs }))

  const { data: farms } = useSuspenseQuery({
    ...farmsBlockchainDetailsQueryOptions({ farmConfigs, wagmiConfig, tokensInfo, chainId, account }),
    select: useCallback(
      (data: FarmBlockchainDetails[]) => mergeBlockchainAndApiDetails(data, farmsApiDetailsResult.data),
      [farmsApiDetailsResult.data],
    ),
  })

  return { farmsInfo: new FarmsInfo(farms) }
}

function mergeBlockchainAndApiDetails(
  blockchainDetails: FarmBlockchainDetails[],
  apiDetails: FarmApiDetails[] | undefined,
): Farm[] {
  return blockchainDetails.map((blockchainDetail, index) => {
    const rewardTokenPrice = apiDetails?.[index]?.rewardTokenPriceUsd
    const rewardToken = rewardTokenPrice
      ? blockchainDetail.rewardToken.clone({ unitPriceUsd: rewardTokenPrice })
      : blockchainDetail.rewardToken
    return {
      ...(apiDetails?.[index] ?? {}),
      ...blockchainDetail,
      rewardToken,
    }
  })
}
