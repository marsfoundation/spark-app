import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ApproveAction } from './types'

export interface ApproveActionRowProps extends ActionRowBaseProps {
  action: ApproveAction
}

export function ApproveActionRow({ action, onAction, layout, ...props }: ApproveActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Approve {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Approve</ActionRow.Trigger>
    </ActionRow>
  )
}
