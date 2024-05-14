import { mainnet } from 'viem/chains'
import { multicall } from 'wagmi/actions'

import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay } from '@/utils/math'

import { Percentage } from '../types/NumericValues'
import { Config } from 'wagmi'
import BigNumber from 'bignumber.js'
import { QueryKey } from '@tanstack/react-query'
import { Savings } from './types'

export interface MainnetSavingsInfoParams {
  wagmiConfig: Config
}

export interface PotParams {
  dsr: BigNumber
  rho: BigNumber
  chi: BigNumber
}

export interface MainnetSavingsInfoResult {
  DSR: Percentage
  potParams: PotParams
}

export interface MainnetSavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<Savings>
}

export function mainnetSavingsInfo({ wagmiConfig }: MainnetSavingsInfoParams): MainnetSavingsInfoQueryOptions {
  const makerPotAddress = getContractAddress(potAddress, mainnet.id)
  return {
    queryKey: ['mainnet-savings-info'],
    queryFn: async () => {
      const [dsr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        chainId: mainnet.id,
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

      const DSR = Percentage(
        fromRay(bigNumberify(dsr))
          .pow(60 * 60 * 24 * 365)
          .minus(1),
      )

      return {
        DSR,
        potParams: {
          dsr: bigNumberify(dsr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
      }
    },
  }
}
