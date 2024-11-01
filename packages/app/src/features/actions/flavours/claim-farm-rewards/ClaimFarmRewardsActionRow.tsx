import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimFarmRewardsAction } from './types'

export interface ClaimFarmRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimFarmRewardsAction
}

export function ClaimFarmRewardsActionRow({ action, onAction, layout, ...props }: ClaimFarmRewardsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={action.rewardToken} className="h-6" />
        Claim rewards
      </ActionRow.Title>

      <ActionRow.Amount token={action.rewardToken} amount={action.rewardAmount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Claim</ActionRow.Trigger>
    </ActionRow>
  )
}
