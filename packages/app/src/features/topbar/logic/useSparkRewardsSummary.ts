import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { useVpnCheck } from '@/features/compliance/logic/useVpnCheck'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SparkRewardsSummary } from '../types'
export interface UseSparkRewardsSummaryParams {
  address: CheckedAddress | undefined
}

export function useSparkRewardsSummary({ address }: UseSparkRewardsSummaryParams): SparkRewardsSummary {
  const wagmiConfig = useConfig()
  const { isInSandbox, sandboxChainId } = useSandboxState()
  const { data: vpnCheck, isPending: isVpnCheckPending } = useVpnCheck()

  const { data: claimableRewards } = useQuery(
    claimableRewardsQueryOptions({
      wagmiConfig,
      account: address,
      isInSandbox,
      sandboxChainId,
    }),
  )

  if (isVpnCheckPending || !claimableRewards) {
    return {}
  }

  const totalUsdAmount = claimableRewards
    .filter((reward) => !reward.restrictedCountryCodes.some((code) => code === vpnCheck?.countryCode))
    .reduce((acc, { rewardToken, cumulativeAmount, preClaimed }) => {
      const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))
      return NormalizedUnitNumber(acc.plus(rewardToken.toUSD(amountToClaim)))
    }, NormalizedUnitNumber(0))

  return {
    totalUsdAmount,
  }
}
