import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { getFormattedValue } from '../../components/action-row/utils'
import { WithdrawAction } from './types'

export interface WithdrawActionRowProps extends ActionRowBaseProps {
  action: WithdrawAction
}

export function WithdrawActionRow({ index, action, actionHandlerState, onAction, variant }: WithdrawActionRowProps) {
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, action.token, variant)

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.withdraw} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Withdraw {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description successMessage={`Withdrew ${formattedValue}!`} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.token} value={action.value} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Withdraw
      </ActionRow.Action>
    </ActionRow>
  )
}
