import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ArrowDownToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { DepositAction } from './types'

export interface DepositActionRowProps extends ActionRowBaseProps {
  action: DepositAction
}

export function DepositActionRow({ action, onAction, layout, ...props }: DepositActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowDownToLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Deposit {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Deposit</ActionRow.Trigger>
    </ActionRow>
  )
}
