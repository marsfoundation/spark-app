import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ApproveDelegationAction } from './types'

export interface ApproveDelegationActionRowProps extends ActionRowBaseProps {
  action: ApproveDelegationAction
}

export function ApproveDelegationActionRow({ action, ...props }: ApproveDelegationActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        Approve delegation {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Approve</ActionRow.Trigger>
    </ActionRow>
  )
}
