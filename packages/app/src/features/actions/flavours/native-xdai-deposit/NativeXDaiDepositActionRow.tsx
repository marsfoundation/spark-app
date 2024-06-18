import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { NativeXDaiDepositAction } from './types'

export interface NativeXDaiDepositActionRowProps extends ActionRowBaseProps {
  action: NativeXDaiDepositAction
}

export function NativeXDaiDepositActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: NativeXDaiDepositActionRowProps) {
  const fromToken = action.xDai
  const toToken = action.sDai
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Wrapped ${fromToken.format(action.value, { style: 'auto' })} ${fromToken.symbol}!`

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Wrap {fromToken.symbol} into {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={fromToken} value={action.value} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Wrap
      </ActionRow.Action>
    </ActionRow>
  )
}
