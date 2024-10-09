import { Panel } from '@/ui/atoms/panel/Panel'
import { ConnectOrSandboxCTAButtonGroup } from '@/ui/molecules/connect-or-sandbox-cta-button-group/ConnectOrSandboxCTAButtonGroup'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

interface ConnectOrSandboxCTAPanelProps {
  iconPaths?: string[]
  header: string
  buttonText: string
  action: () => void
  openSandboxModal: () => void
  disabled?: boolean
}

export function ConnectOrSandboxCTAPanel({
  iconPaths,
  header,
  buttonText,
  action,
  openSandboxModal,
  disabled,
}: ConnectOrSandboxCTAPanelProps) {
  return (
    <Panel.Wrapper>
      <Panel.Content className="flex flex-col gap-6 p-6 text-center md:px-8">
        <div className="flex flex-col items-center gap-6">
          {iconPaths && <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />}
          <ConnectOrSandboxCTAButtonGroup
            header={header}
            action={action}
            buttonText={buttonText}
            openSandboxModal={openSandboxModal}
            disabled={disabled}
          />
        </div>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
