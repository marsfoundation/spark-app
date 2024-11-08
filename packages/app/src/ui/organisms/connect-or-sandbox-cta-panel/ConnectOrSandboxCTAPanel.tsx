import { Panel } from '@/ui/atoms/new/panel/Panel'
import { ConnectOrSandboxCTAButtonGroup } from '@/ui/molecules/connect-or-sandbox-cta-button-group/ConnectOrSandboxCTAButtonGroup'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

interface ConnectOrSandboxCTAPanelProps {
  iconPaths?: string[]
  header: string
  buttonText: string
  action: () => void
  openSandboxModal: () => void
}

export function ConnectOrSandboxCTAPanel({
  iconPaths,
  header,
  buttonText,
  action,
  openSandboxModal,
}: ConnectOrSandboxCTAPanelProps) {
  return (
    <Panel className="flex flex-col items-center gap-6 bg-connect-wallet-cta bg-top bg-no-repeat text-center md:p-12">
      <h4 className="typography-heading-3 text-primary-inverse drop-shadow-xl md:mt-4">{header}</h4>
      {iconPaths && <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />}
      <ConnectOrSandboxCTAButtonGroup action={action} buttonText={buttonText} openSandboxModal={openSandboxModal} />
    </Panel>
  )
}
