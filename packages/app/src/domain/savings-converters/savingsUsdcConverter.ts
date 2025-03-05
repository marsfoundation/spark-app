import { usdcVaultAbi, usdcVaultAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@marsfoundation/common-universal'
import { multicall } from 'wagmi/actions'
import { PotSavingsConverter } from './PotSavingsConverter'
import { SavingsConverterQueryOptions, SavingsConverterQueryParams } from './types'

export function savingsUsdcConverterQueryOptions({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsConverterQueryParams): SavingsConverterQueryOptions {
  return {
    queryKey: ['savings-usdc-converter', { chainId }],
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
