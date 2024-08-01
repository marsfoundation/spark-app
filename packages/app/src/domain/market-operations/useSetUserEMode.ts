import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { useWrite } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'

export interface UseSetUserEModeParams {
  categoryId: number
  enabled?: boolean
  onTransactionSettled?: () => void
}

export function useSetUserEMode({
  categoryId,
  enabled = true,
  onTransactionSettled,
}: UseSetUserEModeParams): ReturnType<typeof useWrite> {
  const lendingPool = useContractAddress(lendingPoolAddress)
  const client = useQueryClient()
  const chainId = useChainId()
  const { address } = useAccount()

  return useWrite(
    {
      abi: poolAbi,
      address: lendingPool,
      functionName: 'setUserEMode',
      args: [categoryId],
      enabled: !!address && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayerQueryKey({ chainId, account: address }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
