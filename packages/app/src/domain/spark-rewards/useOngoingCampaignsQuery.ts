import { SimplifiedQueryResult } from '@/domain/common/query'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { OngoingCampaign, ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { vpnCheckQueryOptions } from '@/features/compliance/logic/vpnCheckQueryOptions'
import { useQueries } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

export type UseOngoingCampaignsQueryResult = SimplifiedQueryResult<OngoingCampaign[]>

export function useOngoingCampaignsQuery(): UseOngoingCampaignsQueryResult {
  const wagmiConfig = useConfig()
  const { isInSandbox } = useSandboxState()

  return useQueries({
    queries: [ongoingCampaignsQueryOptions({ wagmiConfig, isInSandbox }), vpnCheckQueryOptions()],
    combine: ([campaigns, vpnCheck]) => {
      if (campaigns.isPending || vpnCheck.isPending) {
        return { isPending: true, isError: false, error: null, data: undefined }
      }

      if (campaigns.isError) {
        return { isPending: false, isError: true, error: campaigns.error }
      }

      const data = campaigns.data.filter(
        (campaign) => !campaign.restrictedCountryCodes.some((code) => code === vpnCheck.data?.countryCode),
      )

      return { isPending: false, isError: false, error: null, data }
    },
  })
}
