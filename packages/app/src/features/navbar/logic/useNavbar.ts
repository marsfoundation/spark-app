import { getChainConfigEntry } from '@/config/chain'
import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { useChainConfigEntry } from '@/domain/hooks/useChainConfigEntry'
import { aaveDataLayer, aaveDataLayerQueryKey } from '@/domain/market-info/aave-data-layer/query'
import { marketInfoSelectFn } from '@/domain/market-info/marketInfo'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { useOpenDialog } from '@/domain/state/dialogs'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { sandboxDialogConfig } from '@/features/dialogs/sandbox/SandboxDialog'
import { selectNetworkDialogConfig } from '@/features/dialogs/select-network/SelectNetworkDialog'
import { raise } from '@/utils/assert'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { skipToken, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount, useChainId, useChains, useConfig, useEnsAvatar, useEnsName } from 'wagmi'
import { PageLinksInfo } from '../components/PageLinks'
import { AirdropInfo, ConnectedWalletInfo, RewardsInfo, SavingsInfoQueryResults, SupportedChain } from '../types'
import { getWalletIcon } from './getWalletIcon'
import { useAirdropInfo } from './use-airdrop-info/useAirdropInfo'
import { useDisconnect } from './useDisconnect'
import { useNavbarSavingsInfo } from './useNavbarSavingsInfo'
import { useNetworkChange } from './useNetworkChange'
import { useRewardsInfo } from './useRewardsInfo'
import { assets } from '@/ui/assets'

export interface UseNavbarResults {
  currentChain: SupportedChain
  supportedChains: SupportedChain[]
  openSelectNetworkDialog: () => void
  openConnectModal: () => void
  openSandboxDialog: () => void
  isSandboxEnabled: boolean
  savingsInfo?: SavingsInfoQueryResults
  connectedWalletInfo?: ConnectedWalletInfo
  airdropInfo: AirdropInfo
  rewardsInfo: RewardsInfo
  pageLinksInfo: PageLinksInfo
}

export function useNavbar(): UseNavbarResults {
  const currentChainId = useChainId()
  const chains = useChains()
  const { markets: marketsConfig } = useChainConfigEntry()
  const { openConnectModal = () => {} } = useConnectModal()
  const { address, connector } = useAccount()
  const { data: ensName } = useEnsName({
    address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
  })
  const blockExplorerAddressLink = useBlockExplorerAddressLink({ address })
  const openDialog = useOpenDialog()

  const wagmiConfig = useConfig()

  const savingsInfo = useNavbarSavingsInfo()
  const marketInfo = useQuery({
    queryKey: aaveDataLayerQueryKey({ chainId: currentChainId, account: address && CheckedAddress(address) }),
    queryFn: marketsConfig
      ? aaveDataLayer({ wagmiConfig, account: address && CheckedAddress(address), chainId: currentChainId }).queryFn
      : skipToken,
    select: useMemo(() => marketInfoSelectFn(), []),
  })
  const airdropInfo = useAirdropInfo({ refreshIntervalInMs: 100 })
  const { isInSandbox, isSandboxEnabled, isEphemeralAccount, deleteSandbox } = useSandboxState()
  const { changeNetworkAsync } = useNetworkChange()
  const { disconnect } = useDisconnect({
    changeNetworkAsync,
    deleteSandbox,
    isInSandbox,
  })
  const rewardsInfo = useRewardsInfo(marketInfo)

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
        avatar: ensAvatar ?? assets.walletIcons.default,
        address: CheckedAddress(address),
        ensName: ensName ? EnsName(ensName) : undefined,
      },
      dropdownContentInfo: {
        walletIcon: getWalletIcon(connector),
        address: CheckedAddress(address),
        onDisconnect: disconnect,
        blockExplorerAddressLink,
        isEphemeralAccount: isEphemeralAccount(address),
        isInSandbox,
      },
    }
  })()

  const { daiSymbol, usdsSymbol } = getChainConfigEntry(currentChain.id)

  const pageLinksInfo = {
    daiSymbol,
    usdsSymbol,
  }

  function openSandboxDialog(): void {
    openDialog(sandboxDialogConfig, { mode: 'ephemeral' } as const)
  }

  function openSelectNetworkDialog(): void {
    openDialog(selectNetworkDialogConfig, {})
  }

  return {
    currentChain,
    supportedChains,
    openSelectNetworkDialog,
    openConnectModal,
    savingsInfo,
    connectedWalletInfo,
    airdropInfo,
    rewardsInfo,
    openSandboxDialog,
    isSandboxEnabled,
    pageLinksInfo,
  }
}
