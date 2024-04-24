import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { aaveDataLayer } from '@/domain/market-info/aave-data-layer/query'

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
  const wagmiConfig = useConfig()
  const chainId = useChainId()
  const { address } = useAccount()

  const config = ensureConfigTypes({
    abi: poolAbi,
    address: lendingPool,
    functionName: 'setUserEMode',
    args: [categoryId],
  })

  return useWrite(
    {
      ...config,
      enabled: !!address && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: address }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
