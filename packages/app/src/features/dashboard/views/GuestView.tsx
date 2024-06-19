import { assets } from '@/ui/assets'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { CallToActionPanel } from '@/ui/organisms/call-to-action-panel/CallToActionPanel'

export interface GuestViewProps {
  openConnectModal: () => void
  acitvateSandbox: () => void
}

export function GuestView({ openConnectModal, acitvateSandbox }: GuestViewProps) {
  return (
    <PageLayout className="max-w-6xl">
      <CallToActionPanel
        callToAction="Connect your wallet to use Spark"
        iconPaths={WALLET_ICONS_PATHS}
        action={openConnectModal}
        actionButtonText="Connect wallet"
        activateSandbox={acitvateSandbox}
      />
    </PageLayout>
  )
}

const icons = assets.walletIcons
const WALLET_ICONS_PATHS = [icons.metamask, icons.walletConnect, icons.coinbase, icons.enjin, icons.torus]
