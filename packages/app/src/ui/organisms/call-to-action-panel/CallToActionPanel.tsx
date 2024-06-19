import MagicWand from '@/ui/assets/magic-wand.svg?react'
import { Panel } from '@/ui/atoms/panel/Panel'
import { IconStack } from '@/ui/molecules/icon-stack/IconStack'
import { ButtonStack } from '@/ui/molecules/primary-secondary-button-stack/ButtonStack'

interface CallToActionPanelProps {
  iconPaths: string[]
  callToAction: string
  actionButtonText: string
  action: () => void
  openSandboxModal: () => void
}

export function CallToActionPanel({
  iconPaths,
  callToAction,
  actionButtonText,
  action,
  openSandboxModal,
}: CallToActionPanelProps) {
  return (
    <Panel.Wrapper>
      <Panel.Content className="flex flex-col gap-6 p-6 text-center md:px-8">
        <div className="flex flex-col items-center gap-6">
          <IconStack paths={iconPaths} size="lg" stackingOrder="first-on-top" />
          <ButtonStack
            primaryButton={{
              onClickAction: action,
              text: actionButtonText,
              header: callToAction,
            }}
            secondaryButton={{
              onClickAction: openSandboxModal,
              text: 'Activate Sandbox Mode',
              header: 'or explore in Sandbox Mode with unlimited tokens',
              prefixIcon: <MagicWand className="h-5 w-5 text-basics-dark-grey" />,
            }}
          />
        </div>
      </Panel.Content>
    </Panel.Wrapper>
  )
}
