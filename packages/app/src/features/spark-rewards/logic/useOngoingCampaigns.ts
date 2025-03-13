import { paths } from '@/config/paths'
import { SimplifiedQueryResult, transformSimplifiedQueryResult } from '@/domain/common/query'
import { OngoingCampaign } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { useOngoingCampaignsQuery } from '@/domain/spark-rewards/useOngoingCampaignsQuery'
import { assertNever } from '@marsfoundation/common-universal'
import { NavigateFunction, generatePath, useNavigate } from 'react-router-dom'
import { Config, useSwitchChain } from 'wagmi'
import { SwitchChainMutate } from 'wagmi/query'
import { OngoingCampaignRow } from '../types'

export type UseOngoingCampaignsResult = SimplifiedQueryResult<OngoingCampaignRow[]>

export function useOngoingCampaigns(): UseOngoingCampaignsResult {
  const ongoingCampaignsResult = useOngoingCampaignsQuery()
  const navigate = useNavigate()
  const { switchChain } = useSwitchChain()

  return transformSimplifiedQueryResult(ongoingCampaignsResult, (data) =>
    data.map((campaign) => ({
      ...campaign,
      involvedTokensSymbols:
        campaign.type === 'sparklend'
          ? [...campaign.depositTokenSymbols, ...campaign.borrowTokenSymbols]
          : campaign.type === 'savings'
            ? campaign.depositToSavingsTokenSymbols
            : [],
      ...getEngageButtonProps({ campaign, navigate, switchChain }),
    })),
  )
}

interface GetEngageButtonPropsParams {
  campaign: OngoingCampaign
  navigate: NavigateFunction
  switchChain: SwitchChainMutate<Config, unknown>
}
function getEngageButtonProps({
  campaign,
  navigate,
  switchChain,
}: GetEngageButtonPropsParams): Pick<OngoingCampaignRow, 'engageButtonText' | 'onEngageButtonClick'> {
  if (campaign.type === 'external' || campaign.type === 'social') {
    return {
      engageButtonText: `Go to ${campaign.type === 'social' ? capitalizeFirstLetter(campaign.platform) : 'website'}`,
      onEngageButtonClick: () => {
        window.open(campaign.link, '_blank')
      },
    }
  }

  if (campaign.type === 'sparklend') {
    return {
      engageButtonText: 'Go to My Portfolio',
      onEngageButtonClick: () => {
        navigate(generatePath(paths.myPortfolio))
        switchChain({ chainId: campaign.chainId })
      },
    }
  }

  if (campaign.type === 'savings') {
    return {
      engageButtonText: 'Go to Savings',
      onEngageButtonClick: () => {
        navigate(generatePath(paths.savings))
      },
    }
  }

  assertNever(campaign)
}

function capitalizeFirstLetter(val: string): string {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
