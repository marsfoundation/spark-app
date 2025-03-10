import { OngoingCampaign } from './ongoingCampaignsQueryOptions'

export interface FilterOngoingCampaignsArgs {
  campaigns: OngoingCampaign[]
  chainId: number
  countryCode: string | undefined
}

export function filterOngoingCampaigns({
  campaigns,
  chainId,
  countryCode,
}: FilterOngoingCampaignsArgs): OngoingCampaign[] {
  return campaigns
    .filter((campaign) => campaign.chainId === chainId)
    .filter((campaign) => campaign.restrictedCountryCodes.every((code) => code !== countryCode))
}
