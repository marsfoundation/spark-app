import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { DepositToSavingsAction } from './types'

export interface DepositToSavingsActionRowProps extends ActionRowBaseProps {
  action: DepositToSavingsAction
}

export function DepositToSavingsActionRow({
  action,
  index,
  actionHandlerState,
  onAction,
  variant,
}: DepositToSavingsActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.token.symbol), getTokenImage(action.savingsToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Converted ${action.token.format(action.value, { style: 'auto' })} ${action.token.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Convert {action.token.symbol} to {action.savingsToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.token} value={action.value} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Convert
      </ActionRow.Action>
    </ActionRow>
  )
}
