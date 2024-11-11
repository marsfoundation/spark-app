import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { ConnectOrSandboxCTAButtonGroup } from './ConnectOrSandboxCTAButtonGroup'

const meta: Meta<typeof ConnectOrSandboxCTAButtonGroup> = {
  title: 'Components/Molecules/ConnectOrSandboxCTAButtonGroup',
  component: ConnectOrSandboxCTAButtonGroup,
  args: {
    buttonText: 'Connect wallet',
    action: () => {},
    openSandboxModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ConnectOrSandboxCTAButtonGroup>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
