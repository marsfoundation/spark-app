import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { SetUseAsCollateralAction } from './types'

export interface SetUseAsCollateralActionRowProps extends ActionRowBaseProps {
  action: SetUseAsCollateralAction
}

export function SetUseAsCollateralActionRow({ action, onAction, layout, ...props }: SetUseAsCollateralActionRowProps) {
  const actionTitle = action.useAsCollateral ? 'Enable' : 'Disable'

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <TokenIcon token={action.token} className="h-6" />
        {actionTitle} {action.token.symbol} as collateral
      </ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger onAction={onAction}>{actionTitle}</ActionRow.Trigger>
    </ActionRow>
  )
}
