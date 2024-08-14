import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { UpgradeAction } from './types'

export interface UpgradeActionRowProps extends ActionRowBaseProps {
  action: UpgradeAction
}

export function UpgradeActionRow({ action, index, actionHandlerState, onAction, variant }: UpgradeActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.fromToken.symbol), getTokenImage(action.toToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Upgraded ${action.fromToken.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.upgrade} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Upgrade {action.fromToken.symbol} to {action.toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.fromToken} value={action.amount} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Upgrade
      </ActionRow.Action>
    </ActionRow>
  )
}
