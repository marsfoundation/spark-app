import { assets } from '@/ui/assets'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'

interface UnsupportedChainViewProps {
  openChainModal: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
  isGuestMode: boolean
}

export function UnsupportedChainView({
  isGuestMode,
  openChainModal,
  openConnectModal,
  openSandboxModal,
}: UnsupportedChainViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <ConnectOrSandboxCTAPanel
        header={`${isGuestMode ? 'Connect' : 'Switch'} to supported chain and start saving!`}
        iconPaths={TOKEN_ICONS}
        action={isGuestMode ? openConnectModal : openChainModal}
        buttonText={isGuestMode ? 'Connect wallet' : 'Switch network'}
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}

const tokens = assets.token
const TOKEN_ICONS = [tokens.usds, tokens.susds, tokens.dai, tokens.sdai, tokens.usdc]
