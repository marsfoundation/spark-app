import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimMarketRewardsAction } from './types'

export interface ClaimMarketRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimMarketRewardsAction
}

export function ClaimMarketRewardsActionRow({ action, onAction, layout, ...props }: ClaimMarketRewardsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Claim rewards
      </ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Claim</ActionRow.Trigger>
    </ActionRow>
  )
}
