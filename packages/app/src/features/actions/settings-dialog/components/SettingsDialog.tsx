import { Settings } from 'lucide-react'

import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { testIds } from '@/ui/utils/testIds'

import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/new/tooltip/Tooltip'
import { UseSettingsDialogResult } from '../logic/useSettingsDialog'
import { SettingsDialogContent } from './SettingsDialogContent'

export interface SettingsDialogProps extends UseSettingsDialogResult {
  disabled?: boolean
}

export function SettingsDialog(props: SettingsDialogProps) {
  const settingsIcon = (
    <IconButton
      icon={Settings}
      spacing="none"
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
      <DialogContent>
        <SettingsDialogContent {...props} />
      </DialogContent>
    </Dialog>
  )
}
