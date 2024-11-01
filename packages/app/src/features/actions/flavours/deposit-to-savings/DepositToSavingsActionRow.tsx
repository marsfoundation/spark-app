import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { getTokenImage } from '@/ui/assets'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ArrowRightLeftIcon } from 'lucide-react'
import { DepositToSavingsAction } from './types'

export interface DepositToSavingsActionRowProps extends ActionRowBaseProps {
  action: DepositToSavingsAction
}

export function DepositToSavingsActionRow({
  action: { savingsToken, token, value },
  onAction,
  layout,
  ...props
}: DepositToSavingsActionRowProps) {
  const tokenIcons = [getTokenImage(token.symbol), getTokenImage(token.symbol)]
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowRightLeftIcon} />

      <ActionRow.Title>
        <IconStack paths={tokenIcons} stackingOrder="last-on-top" />
        Convert {token.symbol} to {savingsToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={savingsToken} amount={value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Convert</ActionRow.Trigger>
    </ActionRow>
  )
}
