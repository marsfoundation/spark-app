import { FileCheck2Icon } from 'lucide-react'
import { ActionRow } from '../../components/action-row/ActionRow'
import { ActionRowBaseProps } from '../../components/action-row/types'
import { SetUserEModeAction } from './logic/types'

export interface SetUserEModeActionRowProps extends ActionRowBaseProps {
  action: SetUserEModeAction
}

export function SetUserEModeActionRow({ action, ...props }: SetUserEModeActionRowProps) {
  const actionTitle = action.eModeCategoryId !== 0 ? 'Enable' : 'Disable'

  return (
    <ActionRow {...props}>
      <ActionRow.Icon icon={FileCheck2Icon} />

      <ActionRow.Title>{actionTitle} E-Mode</ActionRow.Title>

      <ActionRow.ErrorWarning />

      <ActionRow.Trigger>{actionTitle}</ActionRow.Trigger>
    </ActionRow>
  )
}
