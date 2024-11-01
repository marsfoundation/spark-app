import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { cva } from 'class-variance-authority'
import { Actions } from '../components/actions/Actions'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'
import { ActionsGridLayout } from '../types'

const actionsPanelVariants = cva('', {
  variants: {
    layout: {
      extended: '',
      compact: 'gap-0 bg-panel-bg p-4 md:p-4',
    },
  },
})

const actionsTitleVariants = cva('', {
  variants: {
    layout: {
      extended: '',
      compact: 'mb-1 font-semibold text-primary',
    },
  },
})

export interface ActionsViewProps {
  actionHandlers: ActionHandler[]
  settingsDisabled: boolean
  actionsGridLayout: ActionsGridLayout
  settingsDialogProps: UseSettingsDialogResult
}

export function ActionsView({
  actionHandlers,
  actionsGridLayout,
  settingsDisabled,
  settingsDialogProps,
}: ActionsViewProps) {
  return (
    <Panel className={cn(actionsPanelVariants({ layout: actionsGridLayout }))}>
      <Panel.Header className="justify-between">
        <Panel.Title
          variant={actionsGridLayout === 'compact' ? 'prompt' : 'h3'}
          element="h3"
          className={actionsTitleVariants({ layout: actionsGridLayout })}
        >
          Actions
        </Panel.Title>
        <SettingsDialog {...settingsDialogProps} disabled={settingsDisabled} />
      </Panel.Header>
      <Panel.Content className="flex flex-col gap-6">
        <Actions actionHandlers={actionHandlers} layout={actionsGridLayout} />
      </Panel.Content>
    </Panel>
  )
}
