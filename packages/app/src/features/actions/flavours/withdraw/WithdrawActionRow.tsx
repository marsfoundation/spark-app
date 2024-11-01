import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { ArrowUpToLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { WithdrawAction } from './types'

export interface WithdrawActionRowProps extends ActionRowBaseProps {
  action: WithdrawAction
}

export function WithdrawActionRow({ action, onAction, layout, ...props }: WithdrawActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowUpToLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        Withdraw {action.token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={action.token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Withdraw</ActionRow.Trigger>
    </ActionRow>
  )
}
