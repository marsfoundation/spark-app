import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimFarmRewardsAction } from './types'

export interface ClaimFarmRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimFarmRewardsAction
}

export function ClaimFarmRewardsActionRow({ action, ...props }: ClaimFarmRewardsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.rewardToken]} />
        Claim rewards
      </ActionRow.Title>

      <ActionRow.Amount token={action.rewardToken} amount={action.rewardAmount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Claim</ActionRow.Trigger>
    </ActionRow>
  )
}
