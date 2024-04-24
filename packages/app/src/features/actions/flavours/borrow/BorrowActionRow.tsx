import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { getFormattedValue } from '../../components/action-row/utils'
import { BorrowAction } from './types'

export interface BorrowActionRowProps extends ActionRowBaseProps {
  action: BorrowAction
}

export function BorrowActionRow({ index, action, actionHandlerState, onAction, variant }: BorrowActionRowProps) {
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, action.token, variant)

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.borrow} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        Borrow {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description successMessage={`Borrowed ${formattedValue}!`} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.token} value={action.value} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Borrow
      </ActionRow.Action>
    </ActionRow>
  )
}
