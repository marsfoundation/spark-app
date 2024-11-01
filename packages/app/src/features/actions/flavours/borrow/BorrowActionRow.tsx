import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ArrowUpFromLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { BorrowAction } from './types'

export interface BorrowActionRowProps extends ActionRowBaseProps {
  action: BorrowAction
}

export function BorrowActionRow({ action, onAction, layout, ...props }: BorrowActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpFromLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Borrow {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Borrow</ActionRow.Trigger>
    </ActionRow>
  )
}
