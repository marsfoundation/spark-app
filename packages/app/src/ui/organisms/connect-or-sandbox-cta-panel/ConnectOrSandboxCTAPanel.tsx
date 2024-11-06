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
    <Panel variant="secondary" spacing="s" className="flex flex-col items-center gap-6 text-center">
      {iconPaths && <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />}
      <ConnectOrSandboxCTAButtonGroup
        header={header}
        action={action}
        buttonText={buttonText}
        openSandboxModal={openSandboxModal}
      />
    </Panel>
  )
}
