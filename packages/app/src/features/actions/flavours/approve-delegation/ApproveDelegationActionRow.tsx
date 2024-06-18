import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { getFormattedValue } from '../../components/action-row/utils'
import { ApproveDelegationAction } from './types'

export interface ApproveDelegationActionRowProps extends ActionRowBaseProps {
  action: ApproveDelegationAction
}

export function ApproveDelegationActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: ApproveDelegationActionRowProps) {
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, action.token, variant)

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.approve} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Approve delegation {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description
        successMessage={`Approved delegation for ${formattedValue}!`}
        actionStatus={status}
        variant={variant}
      />

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Approve
      </ActionRow.Action>
    </ActionRow>
  )
}
