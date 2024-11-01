import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowDownToLineIcon } from 'lucide-react'
import { StakeAction } from './types'

export interface StakeActionRowProps extends ActionRowBaseProps {
  action: StakeAction
}

export function StakeActionRow({ action: { stakingToken, rewardToken, stakeAmount }, ...props }: StakeActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowDownToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[stakingToken, rewardToken]} />
        Deposit {stakingToken.symbol} into {rewardToken.symbol} Farm
      </ActionRow.Title>

      <ActionRow.Amount token={stakingToken} amount={stakeAmount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Deposit</ActionRow.Trigger>
    </ActionRow>
  )
}
