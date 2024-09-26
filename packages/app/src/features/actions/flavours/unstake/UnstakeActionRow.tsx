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

  const formattedAmount = action.stakingToken.format(action.amount, { style: 'auto' })
  const unstakeSuccessMessage = `Withdrew ${formattedAmount} ${action.stakingToken.symbol}`
  const exitSuccessMessage = `${unstakeSuccessMessage} and claimed rewards`
  const successMessage = `${action.exit ? exitSuccessMessage : unstakeSuccessMessage}!`

  const unstakeActionTitle = `Withdraw ${action.stakingToken.symbol} from ${action.rewardToken.symbol} Farm`
  const exitActionTitle = `Exit from ${action.rewardToken.symbol} Farm`

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.withdraw} actionStatus={status} />

      <ActionRow.Title icon={<IconStack paths={tokenIconPaths} stackingOrder="last-on-top" />} actionStatus={status}>
        {action.exit ? exitActionTitle : unstakeActionTitle}
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant}>
        <UpDownMarker token={action.stakingToken} value={action.amount} direction="up" />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        {action.exit ? 'Exit' : 'Withdraw'}
      </ActionRow.Action>
    </ActionRow>
  )
}
