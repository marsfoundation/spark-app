import { ssrAuthOracleConfig, usdcVaultAbi, usdcVaultAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { getBlock, multicall, readContract } from 'wagmi/actions'
import { PotSavingsConverter } from './PotSavingsConverter'
import { SavingsConverterQueryOptions, SavingsConverterQueryParams } from './types'

export function baseSavingsUsdsConverterQueryOptions({
  wagmiConfig,
  chainId,
}: SavingsConverterQueryParams): SavingsConverterQueryOptions {
  return {
    queryKey: ['base-savings-usds-info', { chainId }],
    queryFn: async () => {
      const [{ timestamp }, { ssr, chi, rho }] = await Promise.all([
        getBlock(wagmiConfig),
        readContract(wagmiConfig, {
          abi: ssrAuthOracleConfig.abi,
          address: getContractAddress(ssrAuthOracleConfig.address, chainId),
          functionName: 'getSUSDSData',
        }),
      ])

      return new PotSavingsConverter({
        potParams: {
          dsr: bigNumberify(ssr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: Number(timestamp),
      })
    },
  }
}

export function baseSavingsUsdcConverterQueryOptions({
  wagmiConfig,
  chainId,
}: SavingsConverterQueryParams): SavingsConverterQueryOptions {
  return {
    queryKey: ['base-savings-usds-info', { chainId }],
    queryFn: async () => {
      const susdcAddress = getContractAddress(usdcVaultAddress, chainId)

      const [{ timestamp }, [ssr, rho, chi]] = await Promise.all([
        getBlock(wagmiConfig),
        multicall(wagmiConfig, {
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
        }),
      ])

      return new PotSavingsConverter({
        potParams: {
          dsr: bigNumberify(ssr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: Number(timestamp),
      })
    },
  }
}
