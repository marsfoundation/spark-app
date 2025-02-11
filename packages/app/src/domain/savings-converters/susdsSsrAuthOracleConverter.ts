import { ssrAuthOracleConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { readContract } from 'wagmi/actions'
import { PotSavingsConverter } from './PotSavingsConverter'
import { SavingsConverterQueryOptions, SavingsConverterQueryParams } from './types'

export function susdsSsrAuthOracleConverterQueryOptions({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsConverterQueryParams): SavingsConverterQueryOptions {
  return {
    queryKey: ['base-savings-usds-info', { chainId }],
    queryFn: async () => {
      const { ssr, chi, rho } = await readContract(wagmiConfig, {
        abi: ssrAuthOracleConfig.abi,
        address: getContractAddress(ssrAuthOracleConfig.address, chainId),
        functionName: 'getSUSDSData',
      })

      return {
        ssr,
        rho,
        chi,
      }
    },
    select: ({ ssr, rho, chi }) => {
      return new PotSavingsConverter({
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
