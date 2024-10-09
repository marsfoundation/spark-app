import { getChainConfigEntry } from '@/config/chain'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { raise } from '@/utils/assert'
import { transformQueryResult } from '@/utils/transformQueryResult'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { farmsApiDetailsQueryOptions } from './farmApiDetailsQuery'
import { farmsBlockchainDetailsQueryOptions } from './farmBlockchainDetailsQuery'
import { FarmsInfo } from './farmsInfo'

export interface UseFarmsInfoParams {
  chainId?: number
}

export function useFarmsInfo(params: UseFarmsInfoParams = {}): FarmsInfo {
  const wagmiConfig = useConfig()
  const { address: account } = useAccount()
  const _chainId = useChainId()
  const chainId = params.chainId ?? _chainId

  const { farms: farmConfigs, extraTokens } = getChainConfigEntry(chainId)
  const { tokensInfo } = useTokensInfo({ tokens: extraTokens, chainId })

  const farmsApiDetailsResult = useQuery(farmsApiDetailsQueryOptions({ farmConfigs }))

  const farmsBlockchainDetails = useSuspenseQuery(
    farmsBlockchainDetailsQueryOptions({ farmConfigs, wagmiConfig, tokensInfo, chainId, account }),
  )

  const farms = farmsBlockchainDetails.data.map((blockchainDetails) => ({
    blockchainDetails,
    apiDetails: transformQueryResult(
      farmsApiDetailsResult,
      (farmsApiInfo) =>
        farmsApiInfo.find((apiDetails) => apiDetails.address === blockchainDetails.address) ??
        raise(`Farm with address ${blockchainDetails.address} not found`),
    ),
  }))

  return new FarmsInfo(farms)
}
