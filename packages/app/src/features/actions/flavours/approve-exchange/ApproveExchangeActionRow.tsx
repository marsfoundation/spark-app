import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { getFormattedValue } from '../../components/action-row/utils'
import { ApproveExchangeAction } from './types'

export interface ApproveExchangeActionRowProps extends ActionRowBaseProps {
  action: ApproveExchangeAction
}

export function ApproveExchangeActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: ApproveExchangeActionRowProps) {
  const status = actionHandlerState.status
  const fromToken = action.swapParams.fromToken
  const formattedValue = getFormattedValue(action.swapParams.value, fromToken, variant)

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.approve} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={fromToken} className="h-6" />} actionStatus={status}>
        Approve {formattedValue}
      </ActionRow.Title>

      <ActionRow.Description
        successMessage={`Approved for ${formattedValue}!`}
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
