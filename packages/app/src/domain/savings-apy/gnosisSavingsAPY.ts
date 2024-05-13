import { gnosis } from 'viem/chains'
import { readContract } from 'wagmi/actions'

import { savingsXDaiAdapterAbi, savingsXDaiAdapterAddress } from '@/config/contracts-generated'
import { getContractAddress } from '@/domain/hooks/useContractAddress'
import { bigNumberify } from '@/utils/bigNumber'

import { Percentage } from '../types/NumericValues'
import { SavingsAPYParams, SavingsAPYQueryOptions } from './types'

export function gnosisSavingsAPY({ wagmiConfig }: SavingsAPYParams): SavingsAPYQueryOptions {
  const sDaiAdapterAddress = getContractAddress(savingsXDaiAdapterAddress, gnosis.id)
  return {
    queryKey: [
      {
        entity: 'readContract',
        functionName: 'vaultAPY',
        chainId: gnosis.id,
      },
    ],
    queryFn: async () => {
      const vaultAPY = await readContract(wagmiConfig, {
        address: sDaiAdapterAddress,
        functionName: 'vaultAPY',
        args: [],
        abi: savingsXDaiAdapterAbi,
      })

      return Percentage(bigNumberify(vaultAPY).div(1e18), true)
    },
  }
}
