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
            variant="secondary"
            className="text-basics-dark-grey h-[30px] w-[30px] bg-white p-0"
            prefixIcon={<Settings size={18} />}
            data-testid={testIds.actions.settings}
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
