import { assets } from '@/ui/assets'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'

export interface GuestViewProps {
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function GuestView({ openConnectModal, openSandboxModal }: GuestViewProps) {
  return (
    <PageLayout className="max-w-6xl">
      <ConnectOrSandboxCTAPanel
        header="Connect your wallet to use Last"
        iconPaths={WALLET_ICONS_PATHS}
        action={openConnectModal}
        buttonText="Connect wallet"
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]
