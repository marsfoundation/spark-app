import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { UnstakeAction } from './types'

export interface UnstakeActionRowProps extends ActionRowBaseProps {
  action: UnstakeAction
}

export function UnstakeActionRow({ action, index, actionHandlerState, onAction, variant }: UnstakeActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.rewardToken.symbol), getTokenImage(action.stakingToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Unstaked ${action.stakingToken.format(action.amount, { style: 'auto' })} ${action.stakingToken.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.withdraw} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Unstake {action.stakingToken.symbol} from {action.rewardToken.symbol} Farm
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.stakingToken} value={action.amount} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Unstake
      </ActionRow.Action>
    </ActionRow>
  )
}
