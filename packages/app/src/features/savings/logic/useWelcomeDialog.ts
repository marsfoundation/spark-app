import { useSavingsDaiInfo } from '@/domain/savings-info/useSavingsDaiInfo'
import { useSavingsUsdsInfo } from '@/domain/savings-info/useSavingsUsdsInfo'
import { useSavingsStore } from '@/domain/state/savings'
import { useCompliance } from '@/features/compliance/logic/useCompliance'
import { useChainId } from 'wagmi'

export interface UseWelcomeDialogParams {
  chainId?: number
}

export interface UseWelcomeDialogResult {
  showWelcomeDialog: boolean
  saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
}

export function useWelcomeDialog(params: UseWelcomeDialogParams): UseWelcomeDialogResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const { confirmedWelcomeDialog, saveConfirmedWelcomeDialog } = useSavingsStore()
  const { visibleModal: complianceModal } = useCompliance()
  const { savingsUsdsInfo } = useSavingsUsdsInfo({
    chainId,
  })
  const { savingsDaiInfo } = useSavingsDaiInfo({
    chainId,
  })

  return {
    showWelcomeDialog:
      !!savingsUsdsInfo && !!savingsDaiInfo && complianceModal.type === 'none' && !confirmedWelcomeDialog,
    saveConfirmedWelcomeDialog,
  }
}
