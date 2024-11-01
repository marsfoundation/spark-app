import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowBigUpDashIcon } from 'lucide-react'
import { UpgradeAction } from './types'

export interface UpgradeActionRowProps extends ActionRowBaseProps {
  action: UpgradeAction
}

export function UpgradeActionRow({ action: { fromToken, toToken, amount }, ...props }: UpgradeActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowBigUpDashIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[fromToken, toToken]} />
        Upgrade {fromToken.symbol} to {toToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={fromToken} amount={amount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Upgrade</ActionRow.Trigger>
    </ActionRow>
  )
}
