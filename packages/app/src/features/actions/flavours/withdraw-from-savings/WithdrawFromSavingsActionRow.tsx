import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowRightLeftIcon } from 'lucide-react'
import { WithdrawFromSavingsAction } from './types'

export interface WithdrawFromSavingsActionRowProps extends ActionRowBaseProps {
  action: WithdrawFromSavingsAction
}

export function WithdrawFromSavingsActionRow({
  action: { savingsToken, token, amount, mode },
  onAction,
  layout,
  ...props
}: WithdrawFromSavingsActionRowProps) {
  const tokenIcons = [getTokenImage(savingsToken.symbol), getTokenImage(token.symbol)]
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowRightLeftIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Convert {savingsToken.symbol} to {token.symbol}
        {mode === 'send' ? ' and send' : ''}
      </ActionRow.Title>

      <ActionRow.Amount token={savingsToken} amount={amount} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>{mode === 'send' ? 'Send' : 'Convert'}</ActionRow.Trigger>
    </ActionRow>
  )
}
