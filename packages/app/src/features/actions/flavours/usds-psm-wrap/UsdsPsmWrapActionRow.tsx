import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { UsdsPsmWrapAction } from './types'

export interface UsdsPsmWrapActionRowProps extends ActionRowBaseProps {
  action: UsdsPsmWrapAction
}

export function UsdsPsmWrapActionRow({
  action,
  index,
  actionHandlerState,
  onAction,
  variant,
}: UsdsPsmWrapActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.usdc.symbol), getTokenImage(action.usds.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Converted ${action.usdc.format(action.usdcAmount, { style: 'auto' })} ${action.usdc.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Convert {action.usdc.symbol} to {action.usds.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.usdc} value={action.usdcAmount} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Convert
      </ActionRow.Action>
    </ActionRow>
  )
}
