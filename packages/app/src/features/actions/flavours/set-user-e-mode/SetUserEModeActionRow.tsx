import { assets } from '@/ui/assets'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { SetUserEModeAction } from './types'

export interface SetUserEModeActionRowProps extends ActionRowBaseProps {
  action: SetUserEModeAction
}

export function SetUserEModeActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: SetUserEModeActionRowProps) {
  const status = actionHandlerState.status
  const eModeEnabled = action.eModeCategoryId !== 0
  const actionTitle = eModeEnabled ? 'Enable' : 'Disable'
  const successMessage = `E-Mode ${eModeEnabled ? 'enabled' : 'disabled'}!`

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.approve} actionStatus={status} />

      <ActionRow.Title actionStatus={status}>{actionTitle} E-Mode</ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant} />

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        {actionTitle}
      </ActionRow.Action>
    </ActionRow>
  )
}
