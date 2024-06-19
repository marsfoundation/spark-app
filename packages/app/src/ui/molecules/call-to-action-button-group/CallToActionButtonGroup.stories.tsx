import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { CallToActionButtonGroup } from './CallToActionButtonGroup'

const meta: Meta<typeof CallToActionButtonGroup> = {
  title: 'Components/Molecules/CallToActionButtonGroup',
  component: CallToActionButtonGroup,
  args: {
    header: 'Connect your wallet and start saving!',
    buttonText: 'Connect wallet',
    action: () => {},
    openSandboxModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CallToActionButtonGroup>

export const Default: Story = {
  name: 'Default',
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
