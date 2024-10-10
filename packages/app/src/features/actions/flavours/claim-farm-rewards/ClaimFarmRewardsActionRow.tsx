import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ActionRow } from '../../components/action-row/ActionRow'
import { UpDownMarker } from '../../components/action-row/UpDownMarker'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ClaimFarmRewardsAction } from './types'

export interface ClaimFarmRewardsActionRowProps extends ActionRowBaseProps {
  action: ClaimFarmRewardsAction
}

export function ClaimFarmRewardsActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: ClaimFarmRewardsActionRowProps) {
  const status = actionHandlerState.status

  return (
    <ActionRow index={index}>
      <ActionRow.Icon path={assets.actions.withdraw} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.rewardToken} className="h-6" />} actionStatus={status}>
        Claim rewards
      </ActionRow.Title>

      <ActionRow.Description successMessage="Rewards claimed!" actionStatus={status} variant={variant}>
        <UpDownMarker
          token={action.rewardToken}
          tokenFormatOptions={{ tokenUnitPriceOverride: action.rewardTokenPrice }}
          value={action.rewardAmount}
          direction="up"
        />
      </ActionRow.Description>

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        Claim
      </ActionRow.Action>
    </ActionRow>
  )
}
