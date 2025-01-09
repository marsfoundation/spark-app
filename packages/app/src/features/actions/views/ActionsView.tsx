import { Loader } from '@/ui/atoms/loader/Loader'
import { cn } from '@/ui/utils/style'
import { usePortalRef } from '@/ui/utils/usePortalRef'
import { cva } from 'class-variance-authority'
import { Actions } from '../components/actions/Actions'
import { ActionHandler } from '../logic/types'
import { SettingsDialog } from '../settings-dialog/components/SettingsDialog'
import { UseSettingsDialogResult } from '../settings-dialog/logic/useSettingsDialog'
import { ActionsGridLayout } from '../types'

const actionsTitleVariants = cva('', {
  variants: {
    layout: {
      extended: 'typography-heading-5 text-primary',
      compact: 'typography-label-3 text-secondary',
    },
  },
})

export interface ActionsViewProps {
  actionHandlers: ActionHandler[]
  settingsDisabled: boolean
  actionsGridLayout: ActionsGridLayout
  settingsDialogProps: UseSettingsDialogResult
  loading: boolean
}

export function ActionsView({
  actionHandlers,
  actionsGridLayout,
  settingsDisabled,
  settingsDialogProps,
  loading,
}: ActionsViewProps) {
  const { portalRef: dialogPortalRef, refCallback: dialogPortalRefCallback } = usePortalRef()
  return (
    <section className="flex flex-col gap-2" ref={dialogPortalRefCallback}>
      <div className="flex items-center justify-between">
        <h3 className={cn(actionsTitleVariants({ layout: actionsGridLayout }))}>Actions</h3>
        <SettingsDialog
          {...settingsDialogProps}
          portalContainerRef={dialogPortalRef}
          disabled={settingsDisabled}
          actionsGridLayout={actionsGridLayout}
        />
      </div>
      <div className="rounded-sm border border-primary">
        {loading ? <Loader size={20} /> : <Actions actionHandlers={actionHandlers} layout={actionsGridLayout} />}
      </div>
    </section>
  )
}
