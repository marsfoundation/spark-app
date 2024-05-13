import { mainnet } from 'viem/chains'
import { readContract } from 'wagmi/actions'

import { potAbi, potAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay } from '@/utils/math'

import { Percentage } from '../types/NumericValues'
import { SavingsAPYParams, SavingsAPYQueryOptions } from './types'

export function mainnetSavingsAPY({ wagmiConfig }: SavingsAPYParams): SavingsAPYQueryOptions {
  const makerPotAddress = getContractAddress(potAddress, mainnet.id)
  return {
    queryKey: [
      {
        entity: 'readContract',
        functionName: 'dsr',
        chainId: mainnet.id,
      },
    ],
    queryFn: async () => {
      const dsr = await readContract(wagmiConfig, {
        address: makerPotAddress,
        functionName: 'dsr',
        args: [],
        abi: potAbi,
      })

      return Percentage(
        fromRay(bigNumberify(dsr))
          .pow(60 * 60 * 24 * 365)
          .minus(1),
        true,
      )
    },
  }
}
