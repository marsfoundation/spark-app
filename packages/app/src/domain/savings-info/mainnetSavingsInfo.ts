import { multicall } from 'wagmi/actions'

import { potAbi, potAddress, sUsdsConfig } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'

import { USDS_DEV_CHAIN_ID } from '@/config/chain/constants'
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
      if (chainId !== USDS_DEV_CHAIN_ID) {
        return null
      }

      const [ssr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: getContractAddress(sUsdsConfig.address, chainId),
            functionName: 'ssr',
            args: [],
            abi: sUsdsConfig.abi,
          },
          {
            address: getContractAddress(sUsdsConfig.address, chainId),
            functionName: 'rho',
            args: [],
            abi: sUsdsConfig.abi,
          },
          {
            address: getContractAddress(sUsdsConfig.address, chainId),
            functionName: 'chi',
            args: [],
            abi: sUsdsConfig.abi,
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
