import { getChainConfigEntry } from '@/config/chain'
import { useTokensInfo } from '@/domain/wallet/useTokens/useTokensInfo'
import { raise } from '@/utils/assert'
import { transformQueryResult } from '@/utils/transformQueryResult'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { farmsApiInfoQueryOptions } from './farmApiInfoQuery'
import { farmsBlockchainInfoQueryOptions } from './farmBlockchainInfoQuery'
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

  const farmsApiInfoResult = useQuery(farmsApiInfoQueryOptions({ farmConfigs }))

  const farmsBlockchainInfo = useSuspenseQuery(
    farmsBlockchainInfoQueryOptions({ farmConfigs, wagmiConfig, tokensInfo, chainId, account }),
  )

  const farms = farmsBlockchainInfo.data.map((farmBlockchainInfo) => ({
    blockchainInfo: farmBlockchainInfo,
    apiInfo: transformQueryResult(
      farmsApiInfoResult,
      (farmsApiInfo) =>
        farmsApiInfo.find((farm) => farm.address === farmBlockchainInfo.address) ??
        raise(`Farm with address ${farmBlockchainInfo.address} not found`),
    ),
  }))

  return new FarmsInfo(farms)
}
