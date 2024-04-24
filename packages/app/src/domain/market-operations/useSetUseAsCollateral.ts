import { useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { poolAbi } from '@/config/abis/poolAbi'
import { lendingPoolAddress } from '@/config/contracts-generated'
import { useContractAddress } from '@/domain/hooks/useContractAddress'
import { ensureConfigTypes, useWrite } from '@/domain/hooks/useWrite'
import { aaveDataLayer } from '@/domain/market-info/aave-data-layer/query'

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
  const wagmiConfig = useConfig()

  const config = ensureConfigTypes({
    abi: poolAbi,
    address: lendingPool,
    functionName: 'setUserUseReserveAsCollateral',
    args: [asset, useAsCollateral],
  })

  return useWrite(
    {
      ...config,
      enabled: !!userAddress && enabled,
    },
    {
      onTransactionSettled: async () => {
        void client.invalidateQueries({
          queryKey: aaveDataLayer({ wagmiConfig, chainId, account: userAddress }).queryKey,
        })

        onTransactionSettled?.()
      },
    },
  )
}
