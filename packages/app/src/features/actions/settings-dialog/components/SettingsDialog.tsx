import { Slot } from '@radix-ui/react-slot'
import { Settings } from 'lucide-react'
import React from 'react'

import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { Tooltip, TooltipContentShort, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { testIds } from '@/ui/utils/testIds'

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
          <Button
            className="h-[30px] w-[30px] rounded-full border-white/10 bg-white/10 p-0 text-white/70"
            prefixIcon={<Settings size={18} />}
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
