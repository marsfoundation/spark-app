import { PageLayout } from '@/ui/layouts/PageLayout'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { mainnet } from 'viem/chains'
import { PageHeader } from '../components/PageHeader'

interface UnsupportedChainViewProps {
  chainId: number
  switchChain: (chainId: number) => void
  openSandboxModal: () => void
}

export function UnsupportedChainView({ chainId, openSandboxModal, switchChain }: UnsupportedChainViewProps) {
  return (
    <PageLayout className="max-w-5xl gap-8 px-3 lg:px-0">
      <PageHeader chainId={chainId} />
      <ConnectOrSandboxCTAPanel
        header={`Switch to ${mainnet.name} and start farming!`}
        action={() => switchChain(mainnet.id)}
        buttonText={`Switch to ${mainnet.name}`}
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}
