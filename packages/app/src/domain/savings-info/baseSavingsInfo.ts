import { ssrAuthOracleConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { QueryKey } from '@tanstack/react-query'
import { readContract } from 'viem/actions'
import { PotSavingsInfo } from './potSavingsInfo'
import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from './types'

export function baseSavingsInfoQueryOptions({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  return {
    queryKey: getBaseSavingsInfoQueryKey({ chainId }),
    queryFn: async () => {
      const { ssr, chi, rho } = await readContract(wagmiConfig, {
        abi: ssrAuthOracleConfig.abi,
        address: getContractAddress(ssrAuthOracleConfig.address, chainId),
        functionName: 'getSUSDSData',
      })

      return new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify(ssr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: timestamp,
      })
    },
  }
}

export function getBaseSavingsInfoQueryKey({ chainId }: { chainId: number }): QueryKey {
  return ['base-savings-info', { chainId }]
}
