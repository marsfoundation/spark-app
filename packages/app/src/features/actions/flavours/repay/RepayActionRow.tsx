import { ArrowsUpFromLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { RepayAction } from './types'

export interface RepayActionRowProps extends ActionRowBaseProps {
  action: RepayAction
}

export function RepayActionRow({ action, ...props }: RepayActionRowProps) {
  const token = action.useAToken ? action.reserve.aToken : action.reserve.token

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowsUpFromLineIcon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[token]} />
        Repay with {token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={token} amount={action.value} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>Repay</ActionRow.Trigger>
    </ActionRow>
  )
}
