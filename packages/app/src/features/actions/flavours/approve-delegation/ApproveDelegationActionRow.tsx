import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { ApproveDelegationAction } from './types'

export interface ApproveDelegationActionRowProps extends ActionRowBaseProps {
  action: ApproveDelegationAction
}

export function ApproveDelegationActionRow({ action, onAction, layout, ...props }: ApproveDelegationActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Approve delegation {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Approve</ActionRow.Trigger>
    </ActionRow>
  )
}
