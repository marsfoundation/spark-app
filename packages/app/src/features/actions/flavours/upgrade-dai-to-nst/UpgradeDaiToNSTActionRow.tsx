import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { UpgradeDaiToNSTAction } from './types'

export interface UpgradeDaiToNSTActionRowProps extends ActionRowBaseProps {
  action: UpgradeDaiToNSTAction
}

export function UpgradeDaiToNSTActionRow({
  action,
  index,
  actionHandlerState,
  onAction,
  variant,
}: UpgradeDaiToNSTActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.dai.symbol), getTokenImage(action.nst.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Upgraded ${action.dai.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.upgrade} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Upgrade {action.dai.symbol} to {action.nst.symbol}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.dai} value={action.amount} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Upgrade
      </ActionRow.Action>
    </ActionRow>
  )
}
