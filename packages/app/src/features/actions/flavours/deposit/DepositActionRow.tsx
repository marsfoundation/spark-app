import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { getFormattedValue } from '../../components/action-row/utils'
import { DepositAction } from './types'

export interface DepositActionRowProps extends ActionRowBaseProps {
  action: DepositAction
}

export function DepositActionRow({ index, action, actionHandlerState, onAction, variant }: DepositActionRowProps) {
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, action.token, variant)

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.deposit} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Deposit {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description successMessage={`Deposited ${formattedValue}!`} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.token} value={action.value} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Deposit
      </ActionRow.Action>
    </ActionRow>
  )
}
