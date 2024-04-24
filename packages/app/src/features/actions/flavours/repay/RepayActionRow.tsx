import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { getFormattedValue } from '../../components/action-row/utils'
import { RepayAction } from './types'

export interface RepayActionRowProps extends ActionRowBaseProps {
  action: RepayAction
}

export function RepayActionRow({ index, action, actionHandlerState, onAction, variant }: RepayActionRowProps) {
  const token = action.useAToken ? action.reserve.aToken : action.reserve.token
  const status = actionHandlerState.status
  const formattedValue = getFormattedValue(action.value, token, variant)

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.repay} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={token} className="h-6" />} actionStatus={status}>
        Repay with {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description successMessage={`Repaid ${formattedValue}!`} actionStatus={status} variant={variant}>
        <UpDownMarker token={token} value={action.value} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={actionHandlerState.status}>
        Repay
      </ActionRow.Action>
    </ActionRow>
  )
}
