import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { SetUseAsCollateralAction } from './types'

export interface SetUseAsCollateralActionRowProps extends ActionRowBaseProps {
  action: SetUseAsCollateralAction
}

export function SetUseAsCollateralActionRow({ action, ...props }: SetUseAsCollateralActionRowProps) {
  const actionTitle = action.useAsCollateral ? 'Enable' : 'Disable'

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>
        <ActionRow.Title.Tokens tokens={[action.token]} />
        {actionTitle} {action.token.symbol} as collateral
      </ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>{actionTitle}</ActionRow.Trigger>
    </ActionRow>
  )
}
