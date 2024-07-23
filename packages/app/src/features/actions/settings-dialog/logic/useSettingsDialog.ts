import { useActionsSettings } from '@/domain/state'
import { useState } from 'react'

export interface UseSettingsDialogResult {
  permitsSettings: {
    preferPermits: boolean
    togglePreferPermits: () => void
  }
  onConfirm: () => void
}

export function useSettingsDialog(): UseSettingsDialogResult {
  const actionsSettings = useActionsSettings()
  const [preferPermits, setPreferPermits] = useState(actionsSettings.preferPermits)

  function onConfirm(): void {
    actionsSettings.setPreferPermits(preferPermits)
  }

  return {
    permitsSettings: {
      preferPermits,
      togglePreferPermits: () => setPreferPermits((prefer) => !prefer),
    },
    onConfirm,
  }
}
