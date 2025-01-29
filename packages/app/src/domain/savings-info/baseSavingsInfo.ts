import { ssrAuthOracleConfig, usdcVaultAbi, usdcVaultAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { multicall, readContract } from 'wagmi/actions'
import { PotSavingsInfo } from './potSavingsInfo'
import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from './types'

export function baseSavingsUsdsInfoQueryOptions({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  return {
    queryKey: ['base-savings-usds-info', { chainId }],
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

export function baseSavingsUsdcInfoQueryOptions({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  return {
    queryKey: ['base-savings-usds-info', { chainId }],
    queryFn: async () => {
      const susdcAddress = getContractAddress(usdcVaultAddress, chainId)

      const [ssr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: susdcAddress,
            functionName: 'ssr',
            args: [],
            abi: usdcVaultAbi,
          },
          {
            address: susdcAddress,
            functionName: 'rho',
            args: [],
            abi: usdcVaultAbi,
          },
          {
            address: susdcAddress,
            functionName: 'chi',
            args: [],
            abi: usdcVaultAbi,
          },
        ],
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
