import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { getFormattedValue } from '../../components/action-row/utils'
import { PermitAction } from './types'

export interface PermitActionRowProps extends ActionRowBaseProps {
  action: PermitAction
}

export function PermitActionRow({ index, action, variant, actionHandlerState, onAction }: PermitActionRowProps) {
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, action.token, variant)
  const successMessage = `Permitted for ${formattedValue}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.approve} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Permit {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant} />

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Permit
      </ActionRow.Action>
    </ActionRow>
  )
}
