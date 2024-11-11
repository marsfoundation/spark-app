import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { WithdrawAction } from './types'

export interface WithdrawActionRowProps extends ActionRowBaseProps {
  action: WithdrawAction
}

export function WithdrawActionRow({ action, ...props }: WithdrawActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        Withdraw {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Withdraw</ActionRow.Trigger>
    </ActionRow>
  )
}
