import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Switch } from '@/ui/atoms/switch/Switch'
import { UseSettingsDialogResult } from '../logic/useSettingsDialog'

export function SettingsDialogContent({
  permitsSettings: { preferPermits, togglePreferPermits },
}: UseSettingsDialogResult) {
  return (
    <div className="grid max-w-xl grid-cols-[_minmax(0,1fr)_auto] items-center gap-x-12 gap-y-5 sm:gap-x-48">
      <DialogTitle className="col-span-full">Settings</DialogTitle>
      <DialogPanel className="col-span-full grid grid-cols-subgrid items-center">
        <div className="flex flex-col gap-2">
          <h3>Use permits when available</h3>
          <p className="text-white/50 text-xs">
            Permits are a way to save gas by avoiding on-chain approve transactions. Instead signed permits are bundled
            with another transactions such as deposit or borrow.
          </p>
        </div>
        <Switch className="ml-auto" checked={preferPermits} onClick={togglePreferPermits} />
      </DialogPanel>
    </div>
  )
}
