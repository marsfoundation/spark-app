import { PageLayout } from '@/ui/layouts/PageLayout'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'

interface UnsupportedChainViewProps {
  chainId: number
  openChainModal: () => void
  openConnectModal: () => void
  openSandboxModal: () => void
  isGuestMode: boolean
}

export function UnsupportedChainView({
  chainId,
  isGuestMode,
  openChainModal,
  openConnectModal,
  openSandboxModal,
}: UnsupportedChainViewProps) {
  return (
    <PageLayout className="max-w-5xl gap-8 px-3 lg:px-0">
      <PageHeader chainId={chainId} />
      <ConnectOrSandboxCTAPanel
        header={`${isGuestMode ? 'Connect' : 'Switch'} to Ethereum and start farming!`}
        action={isGuestMode ? openConnectModal : openChainModal}
        buttonText={isGuestMode ? 'Connect wallet' : 'Switch network'}
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}
