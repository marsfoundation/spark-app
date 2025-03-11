import { SimplifiedQueryResult } from '@/domain/common/query'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { ClaimableRewardData, claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { vpnCheckQueryOptions } from '@/features/compliance/logic/vpnCheckQueryOptions'
import { useQueries } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'

export type UseClaimableRewardsQueryResult = SimplifiedQueryResult<ClaimableRewardData[]>

export function useClaimableRewardsQuery(): UseClaimableRewardsQueryResult {
  const wagmiConfig = useConfig()
  const { address: account } = useAccount()
  const { isInSandbox, sandboxChainId } = useSandboxState()

  return useQueries({
    queries: [
      claimableRewardsQueryOptions({
        wagmiConfig,
        account,
        isInSandbox,
        sandboxChainId,
      }),
      vpnCheckQueryOptions(),
    ],
    combine: ([rewards, vpnCheck]) => {
      if (rewards.isPending || vpnCheck.isPending) {
        return { isPending: true, isError: false, error: null, data: undefined }
      }

      if (rewards.isError) {
        return { isPending: false, isError: true, error: rewards.error }
      }

      const data = rewards.data.filter(
        (reward) => !reward.restrictedCountryCodes.some((code) => code === vpnCheck.data?.countryCode),
      )

      return { isPending: false, isError: false, error: null, data }
    },
  })
}
