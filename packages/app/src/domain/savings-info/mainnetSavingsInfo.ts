import { multicall } from 'wagmi/actions'

import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'

import { NST_DEV_CHAIN_ID } from '@/config/chain/constants'
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

export function mainnetSavingsNstInfoQuery({
  wagmiConfig,
  chainId,
  timestamp,
}: SavingsInfoQueryParams): SavingsInfoQueryOptions {
  return {
    queryKey: ['savings-nst-info', { chainId }],
    queryFn: async () => {
      if (chainId !== NST_DEV_CHAIN_ID) {
        return null
      }

      const [nsr, rho, chi] = await multicall(wagmiConfig, {
        allowFailure: false,
        contracts: [
          {
            address: sNSTAddress,
            functionName: 'nsr',
            args: [],
            abi: sNSTAbi,
          },
          {
            address: sNSTAddress,
            functionName: 'rho',
            args: [],
            abi: sNSTAbi,
          },
          {
            address: sNSTAddress,
            functionName: 'chi',
            args: [],
            abi: sNSTAbi,
          },
        ],
      })

      return new PotSavingsInfo({
        potParams: {
          dsr: bigNumberify(nsr),
          rho: bigNumberify(rho),
          chi: bigNumberify(chi),
        },
        currentTimestamp: timestamp,
      })
    },
  }
}

// @todo: add sNST address to wagmi config once it's available on mainnet
const sNSTAddress = '0xeA8AE08513f8230cAA8d031D28cB4Ac8CE720c68'
const sNSTAbi = [
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'chi',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'nsr',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'rho',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const
