import { sandboxDialogConfig } from '@/features/dialogs/sandbox/SandboxDialog'
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSwitchChain } from 'wagmi'
import { useOpenDialog } from '../state/dialogs'

export interface UseUnsupportedChainResult {
  isGuestMode: boolean
  openConnectModal: () => void
  openChainModal: () => void
  openSandboxModal: () => void
  switchChain: (chainId: number) => void
}

export function useUnsupportedChain(): UseUnsupportedChainResult {
  const openDialog = useOpenDialog()
  const isGuestMode = useAccount().address === undefined
  const { openConnectModal = () => {} } = useConnectModal()
  const { openChainModal = () => {} } = useChainModal()
  const { switchChain } = useSwitchChain()

  function openSandboxModal(): void {
    openDialog(sandboxDialogConfig, { mode: 'ephemeral' } as const)
  }

  return {
    isGuestMode,
    openConnectModal,
    openChainModal,
    openSandboxModal,
    switchChain: (chainId: number) => switchChain({ chainId }),
  }
}
