import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimMarketRewardsAction } from './types'

export interface ClaimMarketRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimMarketRewardsAction
}

export function ClaimMarketRewardsActionRow({ action, ...props }: ClaimMarketRewardsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        Claim rewards
      </ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Claim</ActionRow.Trigger>
    </ActionRow>
  )
}
