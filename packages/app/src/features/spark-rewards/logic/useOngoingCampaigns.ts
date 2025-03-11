import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { vpnCheckQueryOptions } from '@/features/compliance/logic/vpnCheckQueryOptions'
import { SimplifiedQueryResult } from '@/utils/types'
import { useQueries } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { OngoingCampaignRow } from '../types'

export type UseOngoingCampaignsResult = SimplifiedQueryResult<(OngoingCampaignRow & { engage: () => Promise<void> })[]>

export function useOngoingCampaigns(): UseOngoingCampaignsResult {
  const wagmiConfig = useConfig()
  const { isInSandbox, sandboxChainId } = useSandboxState()

  return useQueries({
    queries: [ongoingCampaignsQueryOptions({ wagmiConfig, isInSandbox, sandboxChainId }), vpnCheckQueryOptions()],
    combine: ([campaigns, vpnCheck]) => {
      if (campaigns.isPending || vpnCheck.isPending) {
        return { isPending: true, isError: false, error: null, data: undefined }
      }

      if (campaigns.isError) {
        return { isPending: false, isError: true, error: campaigns.error }
      }

      const data = campaigns.data
        .filter((campaign) => !campaign.restrictedCountryCodes.some((code) => code === vpnCheck.data?.countryCode))
        .map((campaign) => ({
          ...campaign,
          involvedTokensSymbols:
            campaign.type === 'sparklend'
              ? [...campaign.depositTokenSymbols, ...campaign.borrowTokenSymbols]
              : campaign.type === 'savings'
                ? campaign.depositToSavingsTokenSymbols
                : [],
          // @todo: Rewards: implement functionality to get engage function
          engage: () => Promise.resolve(),
        }))

      return { isPending: false, isError: false, error: null, data }
    },
  })
}
