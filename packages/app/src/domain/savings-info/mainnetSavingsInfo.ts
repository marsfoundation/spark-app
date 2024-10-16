import { susdsAbi } from '@/config/abis/susdsAbi'
import { getChainConfigEntry } from '@/config/chain'
import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { raise } from '@/utils/assert'
import { bigNumberify } from '@/utils/bigNumber'
import { multicall } from 'wagmi/actions'
import { PotSavingsInfo } from './potSavingsInfo'
import { SavingsInfoQueryOptions, SavingsInfoQueryParams } from './types'

export function mainnetSavingsDaiInfoQuery({
  wagmiConfig,
  timestamp,
  chainId,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  const makerPotAddress = getContractAddress(potAddress, chainId)
  return {
    queryKey: ['savings-dai-info', { chainId }],
    queryFn: async () => {
      const [dsr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: makerPotAddress,
            functionName: 'dsr',
            args: [],
            abi: potAbi,
          },
          {
            address: makerPotAddress,
            functionName: 'rho',
            args: [],
            abi: potAbi,
          },
          {
            address: makerPotAddress,
            functionName: 'chi',
            args: [],
            abi: potAbi,
          },
        ],
      })

      return new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify(dsr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: timestamp,
      })
    },
  }
}

export function mainnetSavingsUsdsInfoQuery({
  wagmiConfig,
  chainId,
  timestamp,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  return {
    queryKey: ['savings-usds-info', { chainId }],
    queryFn: async () => {
      const chainConfig = getChainConfigEntry(chainId)
      const susdsSymbol = chainConfig.susdsSymbol
      const susdsAddress =
        chainConfig.extraTokens.find(({ symbol }) => symbol === susdsSymbol)?.address ??
        raise('sUSDS address not found')

      const [ssr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: susdsAddress,
            functionName: 'ssr',
            args: [],
            abi: susdsAbi,
          },
          {
            address: susdsAddress,
            functionName: 'rho',
            args: [],
            abi: susdsAbi,
          },
          {
            address: susdsAddress,
            functionName: 'chi',
            args: [],
            abi: susdsAbi,
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
