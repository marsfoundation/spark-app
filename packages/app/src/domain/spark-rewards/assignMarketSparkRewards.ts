import { filter, map, pipe } from 'remeda'
import { TokenSymbol } from '../types/TokenSymbol'
import { OngoingCampaign } from './ongoingCampaignsQueryOptions'
import { MarketSparkRewards } from './types'

export interface AssignMarketSparkRewardsArgs {
  campaigns: Extract<OngoingCampaign, { type: 'sparklend' }>[]
  action: 'supply' | 'borrow'
  reserveTokenSymbol: TokenSymbol
}

export function assignMarketSparkRewards({
  campaigns,
  action,
  reserveTokenSymbol,
}: AssignMarketSparkRewardsArgs): MarketSparkRewards[] {
  function campaignToReward(action: 'supply' | 'borrow') {
    return (campaign: OngoingCampaign): MarketSparkRewards => ({
      rewardTokenSymbol: campaign.rewardTokenSymbol,
      action,
      longDescription: campaign.longDescription,
      apy: campaign.type === 'sparklend' ? campaign.apy : undefined,
    })
  }

  function includesReserve(tokenSymbol: TokenSymbol, action: 'supply' | 'borrow') {
    return (campaign: Extract<OngoingCampaign, { type: 'sparklend' }>) =>
      action === 'supply'
        ? campaign.depositTokenSymbols.includes(tokenSymbol)
        : campaign.borrowTokenSymbols.includes(tokenSymbol)
  }

  return pipe(campaigns, filter(includesReserve(reserveTokenSymbol, action)), map(campaignToReward(action)))
}
