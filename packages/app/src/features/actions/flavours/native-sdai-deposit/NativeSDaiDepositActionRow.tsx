import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { testIds } from '@/ui/utils/testIds'
import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { NativeSDaiDepositAction } from './types'

export interface NativeSDaiDepositActionRowProps extends ActionRowBaseProps {
  action: NativeSDaiDepositAction
}

export function NativeSDaiDepositActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: NativeSDaiDepositActionRowProps) {
  const fromToken = action.token
  const toToken = action.sDai
  const tokenIconPaths = [getTokenImage(fromToken.symbol), getTokenImage(toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Wrapped ${fromToken.format(action.value, { style: 'auto' })} ${fromToken.symbol}!`

  return (
    <ActionRow data-testid={testIds.actions.row(index - 1)}>
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
