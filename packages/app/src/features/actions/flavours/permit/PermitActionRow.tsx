import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { PermitAction } from './types'

export interface PermitActionRowProps extends ActionRowBaseProps {
  action: PermitAction
}

export function PermitActionRow({ action, onAction, layout, ...props }: PermitActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Permit {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Permit</ActionRow.Trigger>
    </ActionRow>
  )
}
