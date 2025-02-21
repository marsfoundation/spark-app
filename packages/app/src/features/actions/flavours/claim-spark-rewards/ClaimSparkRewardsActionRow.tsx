import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimSparkRewardsAction } from './types'

export interface ClaimSparkRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimSparkRewardsAction
}

export function ClaimSparkRewardsActionRow({ action, ...props }: ClaimSparkRewardsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        Claim {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Claim</ActionRow.Trigger>
    </ActionRow>
  )
}
