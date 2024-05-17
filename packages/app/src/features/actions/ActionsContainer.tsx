import { withSuspense } from '@/ui/utils/withSuspense'
import { RequireKeys } from '@/utils/types'

import { ActionsSkeleton } from './components/skeleton/ActionsSkeleton'
import { stringifyObjectivesToStableActions } from './logic/stringifyObjectives'
import { Objective } from './logic/types'
import { useActionHandlers } from './logic/useActionHandlers'
import { useSettingsDialog } from './settings-dialog/logic/useSettingsDialog'
import { ActionsView } from './views/ActionsView'

export interface ActionsContainerProps {
  objectives: Objective[]
  onFinish?: () => void // called only once, after render when all actions are marked successful
  variant?: 'default' | 'dialog'
  enabled?: boolean
}

function ActionsContainer({
  objectives,
  onFinish,
  variant = 'default',
  enabled,
}: RequireKeys<ActionsContainerProps, 'enabled'>) {
  const { handlers, gasPrice, settingsDisabled } = useActionHandlers(objectives, {
    enabled,
    onFinish,
  })
  const settingsDialogProps = useSettingsDialog()

  return (
    <ActionsView
      variant={variant}
      actionHandlers={handlers}
      settingsDisabled={settingsDisabled}
      gasPrice={gasPrice}
      settingsDialogProps={settingsDialogProps}
    />
  )
}

// @note: rerenders ActionsContainer when actions change. This is needed to not break the rule of hooks
function ActionsContainerWithKey(props: ActionsContainerProps) {
  return (
    <ActionsContainer
      {...props}
      key={stringifyObjectivesToStableActions(props.objectives)}
      enabled={props.enabled ?? true}
    />
  )
}
const ActionsContainerWithSuspense = withSuspense(ActionsContainerWithKey, ActionsSkeleton)
export { ActionsContainerWithSuspense as ActionsContainer }
