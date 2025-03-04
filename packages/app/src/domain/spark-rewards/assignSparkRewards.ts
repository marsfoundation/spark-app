import { filter, map, pipe } from 'remeda'
import { TokenSymbol } from '../types/TokenSymbol'
import { OngoingCampaign } from './ongoingCampaignsQueryOptions'
import { SparkReward } from './types'

export interface AssignSparkRewardsArgs {
  campaigns: OngoingCampaign[]
  action: 'supply' | 'borrow'
  reserveTokenSymbol: TokenSymbol
}

export function assignSparkRewards({ campaigns, action, reserveTokenSymbol }: AssignSparkRewardsArgs): SparkReward[] {
  const campaignToReward =
    (action: 'supply' | 'borrow') =>
    (campaign: OngoingCampaign): SparkReward => ({
      rewardTokenSymbol: campaign.rewardTokenSymbol,
      action,
      longDescription: campaign.longDescription,
      apy: campaign.type === 'sparklend' ? campaign.apy : undefined,
    })

  const includesReserve =
    (tokenSymbol: TokenSymbol, action: 'supply' | 'borrow') =>
    (campaign: Extract<OngoingCampaign, { type: 'sparklend' }>) =>
      action === 'supply'
        ? campaign.depositTokenSymbols.includes(tokenSymbol)
        : campaign.borrowTokenSymbols.includes(tokenSymbol)

  return pipe(
    campaigns,
    filter((campaign) => campaign.type === 'sparklend'),
    filter(includesReserve(reserveTokenSymbol, action)),
    map(campaignToReward(action)),
  )
}
