import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { useWrite } from '@/domain/hooks/useWrite'
import { aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'

export interface UseSetUseAsCollateralParams {
  asset: Address
  useAsCollateral: boolean
  enabled?: boolean
  onTransactionSettled?: () => void
}

export function useSetUseAsCollateral({
  asset,
  useAsCollateral,
  enabled = true,
  onTransactionSettled,
}: UseSetUseAsCollateralParams): ReturnType<typeof useWrite> {
  const lendingPool = useContractAddress(lendingPoolAddress)
  const client = useQueryClient()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()

  return useWrite(
    {
      abi: poolAbi,
      address: lendingPool,
      functionName: 'setUserUseReserveAsCollateral',
      args: [asset, useAsCollateral],
      enabled: !!userAddress && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayerQueryKey({ chainId, account: userAddress }),
        })

        onTransactionSettled?.()
      },
    },
  )
}
