import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { UpDownMarker } from '@/features/actions/components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { assets, getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { StakeAction } from './types'

export interface StakeActionRowProps extends ActionRowBaseProps {
  action: StakeAction
}

export function StakeActionRow({ action, index, actionHandlerState, onAction, variant }: StakeActionRowProps) {
  const tokenIconPaths = [getTokenImage(action.stakingToken.symbol), getTokenImage(action.rewardToken.symbol)]
  const status = actionHandlerState.status
  const successMessage = `Staked ${action.stakingToken.format(action.stakeAmount, { style: 'auto' })} ${action.stakingToken.symbol}!`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.exchange} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        Stake {action.stakingToken.symbol} in {action.rewardToken.symbol} Farm
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.stakingToken} value={action.stakeAmount} direction="down" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Stake
      </ActionRow.Action>
    </ActionRow>
  )
}
