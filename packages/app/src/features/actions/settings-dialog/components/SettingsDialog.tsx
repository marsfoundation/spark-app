import { Settings } from 'lucide-react'

import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'
import { testIds } from '@/ui/utils/testIds'

import { UseSettingsDialogResult } from '../logic/useSettingsDialog'
import { SettingsDialogContent } from './SettingsDialogContent'

export function SettingsDialog(props: UseSettingsDialogResult) {
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
        <Button
          variant="secondary"
          className="text-basics-dark-grey h-[30px] w-[30px] bg-white p-0"
          prefixIcon={<Settings size={18} />}
          data-testid={testIds.actions.settings}
        />
      </DialogTrigger>
      <DialogContent>
        <SettingsDialogContent {...props} />
      </DialogContent>
    </Dialog>
  )
}
