import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useChains, useConfig, useEnsAvatar, useEnsName } from 'wagmi'

import { getChainConfigEntry } from '@/config/chain'
import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useOpenDialog } from '@/domain/state/dialogs'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { SandboxDialog } from '@/features/dialogs/sandbox/SandboxDialog'
import { raise } from '@/utils/raise'
import { useTimestamp } from '@/utils/useTimestamp'

import { AirdropInfo, ConnectedWalletInfo, SavingsInfoQueryResults, SupportedChain } from '../types'
import { generateWalletAvatar } from './generateWalletAvatar'
import { getWalletIcon } from './getWalletIcon'
import { useAirdropInfo } from './use-airdrop-info/useAirdropInfo'
import { useDisconnect } from './useDisconnect'
import { useNetworkChange } from './useNetworkChange'
import { useTotalBalance } from './useTotalBalance'

export interface UseNavbarResults {
  currentChain: SupportedChain
  supportedChains: SupportedChain[]
  onNetworkChange: (chainId: number) => void
  openConnectModal: () => void
  openSandboxDialog: () => void
  openDevSandboxDialog: () => void
  isSandboxEnabled: boolean
  isDevSandboxEnabled: boolean
  savingsInfo: SavingsInfoQueryResults
  connectedWalletInfo: ConnectedWalletInfo | undefined
  airdropInfo: AirdropInfo
}

export function useNavbar(): UseNavbarResults {
  const currentChainId = useChainId()
  const chains = useChains()
  const { openConnectModal = () => {} } = useConnectModal()
  const { data: ensName } = useEnsName()
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
  })
  const { address, connector } = useAccount()
  const blockExplorerAddressLink = useBlockExplorerAddressLink(address)
  const openDialog = useOpenDialog()

  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()
  const savingsInfoQueryOptions = getChainConfigEntry(currentChainId).savingsInfoQuery
  const savingsInfo = useQuery(savingsInfoQueryOptions({ wagmiConfig, chainId: currentChainId, timestamp }))

  const balanceInfo = useTotalBalance()
  const airdropInfo = useAirdropInfo({ refreshIntervalInMs: 100 })
  const { isInSandbox, isSandboxEnabled, isDevSandboxEnabled, isEphemeralAccount, deleteSandbox } = useSandboxState()
  const { changeNetwork, changeNetworkAsync } = useNetworkChange()
  const { disconnect } = useDisconnect({
    changeNetworkAsync,
    deleteSandbox,
    isInSandbox,
  })

  const supportedChains: SupportedChain[] = chains.map((chain) => {
    const { meta } = getChainConfigEntry(chain.id)
    return {
      id: chain.id,
      name: meta.name,
    }
  })
  const currentChain = supportedChains.find((chain) => chain.id === currentChainId) ?? {
    id: currentChainId,
    name: supportedChains[0]?.name ?? raise('No supported chains'),
  } // this fallback object is needed when we add new chains

  const connectedWalletInfo: ConnectedWalletInfo | undefined = (() => {
    if (!address || !connector) {
      return undefined
    }

    return {
      dropdownTriggerInfo: {
        mode: isInSandbox ? 'sandbox' : 'connected',
        avatar: ensAvatar ?? generateWalletAvatar(address),
        address: CheckedAddress(address),
        ensName: ensName ? EnsName(ensName) : undefined,
      },
      dropdownContentInfo: {
        walletIcon: getWalletIcon(connector),
        address: CheckedAddress(address),
        onDisconnect: disconnect,
        balanceInfo,
        blockExplorerAddressLink,
        isEphemeralAccount: isEphemeralAccount(address),
        isInSandbox,
      },
    }
  })()

  function openSandboxDialog(): void {
    openDialog(SandboxDialog, { mode: 'ephemeral' } as const)
  }

  function openDevSandboxDialog(): void {
    openDialog(SandboxDialog, { mode: 'persisting' } as const)
  }

  return {
    currentChain,
    supportedChains,
    onNetworkChange: changeNetwork,
    openConnectModal,
    savingsInfo,
    connectedWalletInfo,
    airdropInfo,
    openSandboxDialog,
    openDevSandboxDialog,
    isSandboxEnabled,
    isDevSandboxEnabled,
  }
}
