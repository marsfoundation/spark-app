import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimRewardsAction } from './types'

export interface ClaimRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimRewardsAction
}

export function ClaimRewardsActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: ClaimRewardsActionRowProps) {
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
