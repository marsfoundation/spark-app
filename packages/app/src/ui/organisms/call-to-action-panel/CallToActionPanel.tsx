import { Panel } from '@/ui/atoms/panel/Panel'
import { CallToActionButtonGroup } from '@/ui/molecules/call-to-action-button-group/CallToActionButtonGroup'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'

interface CallToActionPanelProps {
  iconPaths: string[]
  header: string
  buttonText: string
  action: () => void
  openSandboxModal: () => void
}

export function CallToActionPanel({ iconPaths, header, buttonText, action, openSandboxModal }: CallToActionPanelProps) {
  return (
    <Panel.Wrapper>
      <Panel.Content className="flex flex-col gap-6 p-6 text-center md:px-8">
        <div className="flex flex-col items-center gap-6">
          <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />
          <CallToActionButtonGroup
            header={header}
            action={action}
            buttonText={buttonText}
            openSandboxModal={openSandboxModal}
          />
        </div>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
