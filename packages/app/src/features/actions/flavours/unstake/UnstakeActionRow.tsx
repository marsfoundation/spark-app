import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowUpToLineIcon } from 'lucide-react'
import { UnstakeAction } from './types'

export interface UnstakeActionRowProps extends ActionRowBaseProps {
  action: UnstakeAction
}

export function UnstakeActionRow({
  action: { stakingToken, rewardToken, amount, exit },
  ...props
}: UnstakeActionRowProps) {
  const unstakeActionTitle = `Withdraw ${stakingToken.symbol} from ${rewardToken.symbol} Farm`
  const exitActionTitle = `Exit from ${rewardToken.symbol} Farm`

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[rewardToken, stakingToken]} />
        {exit ? exitActionTitle : unstakeActionTitle}
      </ActionRow.Title>

      <ActionRow.Amount token={stakingToken} amount={amount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>{exit ? 'Exit' : 'Withdraw'}</ActionRow.Trigger>
    </ActionRow>
  )
}
