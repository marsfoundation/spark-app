import { cn } from '@/ui/utils/style'
import { cva } from 'class-variance-authority'
import { Actions } from '../components/actions/Actions'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'
import { ActionsGridLayout } from '../types'

const actionsTitleVariants = cva('', {
  variants: {
    layout: {
      extended: 'typography-label-2 text-primary',
      compact: 'typography-label-5 text-secondary',
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
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className={cn(actionsTitleVariants({ layout: actionsGridLayout }))}>
          {actionsGridLayout === 'compact' ? 'Actions' : 'Follow the next steps'}
        </h3>
        <SettingsDialog {...settingsDialogProps} disabled={settingsDisabled} />
      </div>
      <div className="rounded-sm border border-primary">
        <Actions actionHandlers={actionHandlers} layout={actionsGridLayout} />
      </div>
    </section>
  )
}
