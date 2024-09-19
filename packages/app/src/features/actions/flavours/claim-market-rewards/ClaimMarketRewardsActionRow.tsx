import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimMarketRewardsAction } from './types'

export interface ClaimMarketRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimMarketRewardsAction
}

export function ClaimMarketRewardsActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: ClaimMarketRewardsActionRowProps) {
  const status = actionHandlerState.status

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.withdraw} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Claim rewards
      </ActionRow.Title>

      <ActionRow.Description successMessage="Rewards claimed!" actionStatus={status} variant={variant} />

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Claim
      </ActionRow.Action>
    </ActionRow>
  )
}
