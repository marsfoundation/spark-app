import { Slot } from '@radix-ui/react-slot'
import { Settings } from 'lucide-react'
import React from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'

import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { UseSettingsDialogResult } from '../logic/useSettingsDialog'
import { SettingsDialogContent } from './SettingsDialogContent'

export interface SettingsDialogProps extends UseSettingsDialogResult {
  disabled?: boolean
}

export function SettingsDialog(props: SettingsDialogProps) {
  const Wrapper = props.disabled ? DisabledTooltip : Slot

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // save if dialog is closed
          props.onConfirm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Wrapper>
          <IconButton
            icon={Settings}
            spacing="none"
            data-testid={testIds.actions.settings.dialog}
            disabled={props.disabled}
          />
        </Wrapper>
      </DialogTrigger>
      <DialogContent>
        <SettingsDialogContent {...props} />
      </DialogContent>
    </Dialog>
  )
}

interface DisabledTooltipProps {
  children: React.ReactNode
}
function DisabledTooltip({ children }: DisabledTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContentShort>Settings are disabled while actions are in progress.</TooltipContentShort>
    </Tooltip>
  )
}
