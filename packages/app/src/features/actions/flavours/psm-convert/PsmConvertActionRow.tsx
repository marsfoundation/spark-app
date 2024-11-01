import { ActionRow } from '@/features/actions/components/action-row/ActionRow'
import { ActionRowBaseProps } from '@/features/actions/components/action-row/types'
import { ArrowRightLeftIcon } from 'lucide-react'
import { PsmConvertAction } from './types'

export interface PsmConvertActionRowProps extends ActionRowBaseProps {
  action: PsmConvertAction
}

export function PsmConvertActionRow({ action: { inToken, outToken, amount }, ...props }: PsmConvertActionRowProps) {
  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowRightLeftIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[inToken, outToken]} />
        Convert {inToken.symbol} to {outToken.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={inToken} amount={amount} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Convert</ActionRow.Trigger>
    </ActionRow>
  )
}
