import { assets } from '@/ui/assets'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { SetUseAsCollateralAction } from './types'

export interface SetUseAsCollateralActionRowProps extends ActionRowBaseProps {
  action: SetUseAsCollateralAction
}

export function SetUseAsCollateralActionRow({
  index,
  action,
  actionHandlerState,
  onAction,
  variant,
}: SetUseAsCollateralActionRowProps) {
  const useAsCollateral = action.useAsCollateral
  const status = actionHandlerState.status
  const actionTitle = useAsCollateral ? 'Enable' : 'Disable'
  const successMessage = `${useAsCollateral ? 'Enabled' : 'Disabled'} ${action.token.symbol} as collateral!`

  return (
    <ActionRow>
      <ActionRow.Index index={index} />

      <ActionRow.Icon path={assets.actions.approve} actionStatus={status} />

      <ActionRow.Title icon={<TokenIcon token={action.token} className="h-6" />} actionStatus={status}>
        {actionTitle} {action.token.symbol} as collateral
      </ActionRow.Title>

      <ActionRow.Description successMessage={successMessage} actionStatus={status} variant={variant} />

      <ActionRow.ErrorWarning variant={variant} actionHandlerState={actionHandlerState} />

      <ActionRow.Action onAction={onAction} status={status}>
        {actionTitle}
      </ActionRow.Action>
    </ActionRow>
  )
}
