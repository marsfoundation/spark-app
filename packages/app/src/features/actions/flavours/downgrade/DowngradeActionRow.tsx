import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowBigDownDashIcon } from 'lucide-react'
import { DowngradeAction } from './types'

export interface DowngradeActionRowProps extends ActionRowBaseProps {
  action: DowngradeAction
}

export function DowngradeActionRow({ action: { fromToken, toToken, amount }, ...props }: DowngradeActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowBigDownDashIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[fromToken, toToken]} />
        Downgrade {fromToken.symbol} to {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={fromToken} amount={amount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Downgrade</ActionRow.Trigger>
    </ActionRow>
  )
}
