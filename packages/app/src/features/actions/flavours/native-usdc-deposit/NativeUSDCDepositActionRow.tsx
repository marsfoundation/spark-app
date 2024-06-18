import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { NativeUSDCDepositAction } from './types'

export interface NativeUSDCDepositActionRowProps extends ActionRowBaseProps {
  action: NativeUSDCDepositAction
}

export function NativeUSDCDepositActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: NativeUSDCDepositActionRowProps) {
  const fromToken = action.usdc
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
