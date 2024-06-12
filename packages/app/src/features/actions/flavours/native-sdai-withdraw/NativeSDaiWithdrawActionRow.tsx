import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { NativeSDaiWithdrawAction } from './types'

export interface NativeSDaiWithdrawActionRowProps extends ActionRowBaseProps {
  action: NativeSDaiWithdrawAction
}

export function NativeSDaiWithdrawActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: NativeSDaiWithdrawActionRowProps) {
  const fromToken = action.sDai
  const toToken = action.token
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Unwrapped ${fromToken.format(action.value, { style: 'auto' })} ${toToken.symbol}!`

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Unwrap {fromToken.symbol} into {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={toToken} value={action.value} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Unwrap
      </ActionRow.Action>
    </ActionRow>
  )
}
