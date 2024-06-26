import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'

interface UnsupportedChainViewProps {
  openChainModal: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
  guestMode: boolean
}

export function UnsupportedChainView({
  guestMode,
  openChainModal,
  openConnectModal,
  openSandboxModal,
}: UnsupportedChainViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <ConnectOrSandboxCTAPanel
        header={`${guestMode ? 'Connect' : 'Switch'} to supported chain and start saving!`}
        iconPaths={TOKEN_ICONS}
        action={guestMode ? openConnectModal : openChainModal}
        buttonText={guestMode ? 'Connect wallet' : 'Switch network'}
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}

const tokens = assets.token
const TOKEN_ICONS = [tokens.sdai, tokens.dai, tokens.usdc, tokens.usdt]
