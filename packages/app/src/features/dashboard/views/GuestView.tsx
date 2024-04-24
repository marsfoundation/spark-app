import { assets } from '@/ui/assets'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { WalletActionPanel } from '@/ui/organisms/wallet-action-panel/WalletActionPanel'

export interface GuestViewProps {
  openConnectModal: () => void
}

export function GuestView({ openConnectModal }: GuestViewProps) {
  return (
    <PageLayout className="max-w-6xl">
      <WalletActionPanel
        callToAction="Connect your wallet to use Spark"
        iconPaths={WALLET_ICONS_PATHS}
        walletAction={openConnectModal}
        actionButtonTitle="Connect wallet"
      />
    </PageLayout>
  )
}

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]
