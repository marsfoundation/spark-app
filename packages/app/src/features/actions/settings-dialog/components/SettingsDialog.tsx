import { Settings } from 'lucide-react'

import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/ui/atoms/dialog/Dialog'

import { UseSettingsDialogResult } from '../logic/useSettingsDialog'
import { SettingsDialogContent } from './SettingsDialogContent'

export function SettingsDialog(props: UseSettingsDialogResult) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="text-basics-dark-grey h-[30px] w-[30px] bg-white p-0"
          prefixIcon={<Settings size={18} />}
        />
      </DialogTrigger>
      <DialogContent>
        <SettingsDialogContent {...props} />
      </DialogContent>
    </Dialog>
  )
}
