import { getChainConfigEntry } from '@/config/chain'
import { aaveDataLayer, aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { marketInfoSelectFn } from '@/domain/market-info/marketInfo'
import { useOpenDialog } from '@/domain/state/dialogs'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { claimRewardsDialogConfig } from '@/features/dialogs/claim-rewards/ClaimRewardsDialog'
import { RewardsInfo } from '@/features/navbar/types'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useConfig } from 'wagmi'

interface UseRewardsInfoParams {
  chainId: number
  address: CheckedAddress | undefined
}

export function useRewardsInfo({ chainId, address }: UseRewardsInfoParams): RewardsInfo {
  const wagmiConfig = useConfig()
  const { markets: marketsAvailable } = getChainConfigEntry(chainId)

  const marketInfo = useQuery({
    queryKey: aaveDataLayerQueryKey({ chainId, account: address }),
    queryFn: marketsAvailable ? aaveDataLayer({ wagmiConfig, account: address, chainId }).queryFn : skipToken,
    select: useMemo(() => marketInfoSelectFn(), []),
  })

  const openDialog = useOpenDialog()

  return {
    rewards: (marketInfo.data?.userRewards ?? []).map((reward) => ({
      token: reward.token,
      amount: reward.value,
    })),
    onClaim: () => {
      openDialog(claimRewardsDialogConfig, {})
    },
  }
}
