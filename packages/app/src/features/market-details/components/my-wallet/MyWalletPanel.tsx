import { OpenDialogFunction } from '@/domain/state/dialogs'

import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { WalletOverview } from '../../types'
import { MyWallet } from './MyWallet'
import { MyWalletChainMismatch } from './MyWalletChainMismatch'

interface MyWalletPanelProps {
  chainMismatch: boolean
  openDialog: OpenDialogFunction
  walletOverview: WalletOverview
  openConnectModal: () => void
  openSandboxModal: () => void
}

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]

export function MyWalletPanel({
  openDialog,
  walletOverview,
  openConnectModal,
  chainMismatch,
  openSandboxModal,
}: MyWalletPanelProps) {
  if (walletOverview.guestMode) {
    return (
      <ConnectOrSandboxCTAPanel
        header="Connect your wallet to use Spark"
        iconPaths={WALLET_ICONS_PATHS}
        action={openConnectModal}
        buttonText="Connect wallet"
        openSandboxModal={openSandboxModal}
      />
    )
  }

  if (chainMismatch) {
    return <MyWalletChainMismatch />
  }

  return <MyWallet openDialog={openDialog} {...walletOverview} />
}
