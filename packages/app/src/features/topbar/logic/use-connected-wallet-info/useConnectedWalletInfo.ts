import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { assets } from '@/ui/assets'
import { Connector, useEnsAvatar, useEnsName } from 'wagmi'
import { TopbarWalletProps } from '../../components/topbar-wallet/TopbarWallet'
import { getWalletIcon } from './getWalletIcon'
import { useDisconnect } from './useDisconnect'
import { useNetworkChange } from './useNetworkChange'

interface UseConnectedWalletInfoParams {
  address: CheckedAddress | undefined
  connector: Connector | undefined
  isInSandbox: boolean
  deleteSandbox: () => void
}

export function useConnectedWalletInfo({
  connector,
  address,
  isInSandbox,
  deleteSandbox,
}: UseConnectedWalletInfoParams): TopbarWalletProps['connectedWalletInfo'] {
  const { data: ensName } = useEnsName({
    address,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
  })

  const blockExplorerAddressLink = useBlockExplorerAddressLink({ address })

  const { changeNetworkAsync } = useNetworkChange()
  const { disconnect } = useDisconnect({
    changeNetworkAsync,
    deleteSandbox,
    isInSandbox,
  })

  if (!address || !connector) return undefined

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
    },
  }
}
