import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { IconButton } from '@/ui/atoms/icon-button/IconButton'
import { Switch } from '@/ui/atoms/switch/Switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'
import { PortalRef } from '@/ui/utils/usePortalRef'
import { Settings } from 'lucide-react'
import { ActionsGridLayout } from '../../types'
import { UseSettingsDialogResult } from '../logic/useSettingsDialog'

export interface SettingsDialogProps extends UseSettingsDialogResult {
  disabled?: boolean
  portalContainerRef: PortalRef | undefined
  actionsGridLayout: ActionsGridLayout
}

export function SettingsDialog(props: SettingsDialogProps) {
  const settingsIcon = (
    <IconButton
      icon={Settings}
      size="m"
      variant="transparent"
      data-testid={testIds.actions.settings.dialog}
      disabled={props.disabled}
    />
  )

  if (props.disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{settingsIcon}</TooltipTrigger>
        <TooltipContent>Settings are disabled while actions are in progress.</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // save if dialog is closed
          props.onConfirm()
        }
      }}
    >
      <DialogTrigger asChild>{settingsIcon}</DialogTrigger>
      <DialogContent
        portalContainerRef={props.portalContainerRef}
        overlayVariant={props.actionsGridLayout === 'compact' ? 'delicate' : 'default'}
        contentVerticalPosition={props.actionsGridLayout === 'compact' ? 'bottom' : 'center'}
      >
        <MultiPanelDialog>
          <DialogTitle>Settings</DialogTitle>
          <div className="flex items-center gap-8 rounded-sm bg-secondary p-6">
            <div className="flex flex-col gap-2">
              <h3 className="typography-label-2 text-primary">Use permits when available</h3>
              <p className="typography-body-3 text-secondary">
                Permits are a way to save gas by avoiding on-chain approve transactions. Instead signed permits are
                bundled with another transactions such as deposit or borrow.
              </p>
            </div>
            <Switch
              className="ml-auto"
              checked={props.permitsSettings.preferPermits}
              onClick={props.permitsSettings.togglePreferPermits}
            />
          </div>
        </MultiPanelDialog>
      </DialogContent>
    </Dialog>
  )
}
