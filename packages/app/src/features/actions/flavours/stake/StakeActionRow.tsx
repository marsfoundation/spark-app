import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowDownToLineIcon } from 'lucide-react'
import { StakeAction } from './types'

export interface StakeActionRowProps extends ActionRowBaseProps {
  action: StakeAction
}

export function StakeActionRow({
  action: { stakingToken, rewardToken, stakeAmount },
  onAction,
  layout,
  ...props
}: StakeActionRowProps) {
  const tokenIcons = [getTokenImage(stakingToken.symbol), getTokenImage(rewardToken.symbol)]

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowDownToLineIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Deposit {stakingToken.symbol} into {rewardToken.symbol} Farm
      </ActionRow.Title>

      <ActionRow.Amount token={stakingToken} amount={stakeAmount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Deposit</ActionRow.Trigger>
    </ActionRow>
  )
}
