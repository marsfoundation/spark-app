import { withSuspense } from '@/ui/utils/withSuspense'
import { RequireKeys } from '@/utils/types'
import { ActionsSkeleton } from './components/skeleton/ActionsSkeleton'
import { stringifyObjectivesToStableActions } from './logic/stringifyObjectives'
import { InjectedActionsContext, Objective } from './logic/types'
import { useActionHandlers } from './logic/useActionHandlers'
import { useSettingsDialog } from './settings-dialog/logic/useSettingsDialog'
import { ActionsGridLayout } from './types'
import { ActionsView } from './views/ActionsView'

export interface ActionsContainerProps {
  objectives: Objective[]
  context?: InjectedActionsContext
  onFinish?: () => void // called only once, after render when all actions are marked successful
  actionsGridLayout: ActionsGridLayout
  enabled?: boolean
}

function ActionsContainer({
  objectives,
  context,
  onFinish,
  actionsGridLayout,
  enabled,
}: RequireKeys<ActionsContainerProps, 'enabled'>) {
  const { handlers, settingsDisabled } = useActionHandlers(objectives, {
    context,
    enabled,
    onFinish,
  })
  const settingsDialogProps = useSettingsDialog()

  return (
    <ActionsView
      actionsGridLayout={actionsGridLayout}
      actionHandlers={handlers}
      settingsDisabled={settingsDisabled}
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
