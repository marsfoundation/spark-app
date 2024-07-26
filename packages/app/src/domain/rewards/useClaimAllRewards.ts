import { incentiveControllerAbi } from '@/config/abis/incentiveControllerAbi'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'
import { useWrite } from '../hooks/useWrite'
import { aaveDataLayerQueryKey } from '../market-info/aave-data-layer/query'
import { CheckedAddress } from '../types/CheckedAddress'
import { getBalancesQueryKeyPrefix } from '../wallet/getBalancesQueryKeyPrefix'

export interface UseClaimAllRewardsParams {
  assets: CheckedAddress[]
  incentiveControllerAddress: CheckedAddress
  enabled?: boolean
  onTransactionSettled?: () => void
}

export function useClaimAllRewards({
  assets,
  incentiveControllerAddress,
  enabled = true,
  onTransactionSettled,
}: UseClaimAllRewardsParams): ReturnType<typeof useWrite> {
  const queryClient = useQueryClient()
  const chainId = useChainId()
  const { address: account } = useAccount()

  return useWrite(
    {
      address: incentiveControllerAddress,
      abi: incentiveControllerAbi,
      functionName: 'claimAllRewards',
      args: [assets, account!],
      enabled: Boolean(enabled && account && assets.length > 0),
    },
    {
      onTransactionSettled: async () => {
        void queryClient.invalidateQueries({
          queryKey: aaveDataLayerQueryKey({ chainId, account }),
        })
        void queryClient.invalidateQueries({
          queryKey: getBalancesQueryKeyPrefix({ chainId, account }),
        })
        onTransactionSettled?.()
      },
    },
  )
}
