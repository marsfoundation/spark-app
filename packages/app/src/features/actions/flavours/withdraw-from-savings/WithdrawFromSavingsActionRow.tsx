import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowRightLeftIcon } from 'lucide-react'
import { WithdrawFromSavingsAction } from './types'

export interface WithdrawFromSavingsActionRowProps extends ActionRowBaseProps {
  action: WithdrawFromSavingsAction
}

export function WithdrawFromSavingsActionRow({
  action: { savingsToken, token, amount, mode },
  ...props
}: WithdrawFromSavingsActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowRightLeftIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[savingsToken, token]} />
        Convert {savingsToken.symbol} to {token.symbol}
        {mode === 'send' ? ' and send' : ''}
      </ActionRow.Title>

      <ActionRow.Amount token={savingsToken} amount={amount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>{mode === 'send' ? 'Send' : 'Convert'}</ActionRow.Trigger>
    </ActionRow>
  )
}
