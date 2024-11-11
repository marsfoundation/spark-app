import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ApproveAction } from './types'

export interface ApproveActionRowProps extends ActionRowBaseProps {
  action: ApproveAction
}

export function ApproveActionRow({ action, ...props }: ApproveActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        Approve {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Approve</ActionRow.Trigger>
    </ActionRow>
  )
}
