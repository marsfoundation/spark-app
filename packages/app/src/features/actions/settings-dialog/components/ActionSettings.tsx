import { Settings } from 'lucide-react'

import { Button } from '@/ui/atoms/button/Button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/ui/atoms/dialog/Dialog'

interface ActionSettingsProps {
  openSettings: () => void
}

export function ActionSettings({ openSettings }: ActionSettingsProps) {
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
