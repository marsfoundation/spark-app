import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ArrowsUpFromLineIcon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { RepayAction } from './types'

export interface RepayActionRowProps extends ActionRowBaseProps {
  action: RepayAction
}

export function RepayActionRow({ action, onAction, layout, ...props }: RepayActionRowProps) {
  const token = action.useAToken ? action.reserve.aToken : action.reserve.token

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={ArrowsUpFromLineIcon} />

      <ActionRow.Title>
        <TokenIcon token={token} className="h-6" />
        Repay with {token.symbol}
      </ActionRow.Title>

      <ActionRow.Amount token={token} amount={action.value} layout={layout} />

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>Repay</ActionRow.Trigger>
    </ActionRow>
  )
}
