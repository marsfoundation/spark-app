import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { useSavingsStore } from '@/domain/state/savings'
import { useCompliance } from '@/features/compliance/logic/useCompliance'

export interface UseWelcomeDialogResult {
  showWelcomeDialog: boolean
  saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
}

export function useWelcomeDialog() {
  const { confirmedWelcomeDialog, saveConfirmedWelcomeDialog } = useSavingsStore()
  const { visibleModal: complianceModal } = useCompliance()
  const { savingsUsdsInfo } = useSavingsUsdsInfo()

  return {
    showWelcomeDialog: !!savingsUsdsInfo && complianceModal.type === 'none' && !confirmedWelcomeDialog,
    saveConfirmedWelcomeDialog,
  }
}
