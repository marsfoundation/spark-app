import { Settings } from 'lucide-react'

import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'

interface SettingsDialogProps {
  openSettings: () => void
}

export function SettingsDialog({ openSettings }: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="text-basics-dark-grey h-[30px] w-[30px] bg-white p-0"
          onClick={openSettings}
          prefixIcon={<Settings size={18} />}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
      </DialogContent>
    </Dialog>
  )
}
