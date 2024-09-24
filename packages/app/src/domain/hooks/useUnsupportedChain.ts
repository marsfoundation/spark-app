import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useOpenDialog } from '../state/dialogs'

export interface UseUnsupportedChainResult {
  isGuestMode: boolean
  openConnectModal: () => void
  openChainModal: () => void
  openSandboxModal: () => void
}

export function useUnsupportedChain(): UseUnsupportedChainResult {
  const openDialog = useOpenDialog()
  const isGuestMode = useAccount().isConnected === false
  const { openConnectModal = () => {} } = useConnectModal()
  const { openChainModal = () => {} } = useChainModal()

  function openSandboxModal(): void {
    openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
  }

  return {
    isGuestMode,
    openConnectModal,
    openChainModal,
    openSandboxModal,
  }
}
