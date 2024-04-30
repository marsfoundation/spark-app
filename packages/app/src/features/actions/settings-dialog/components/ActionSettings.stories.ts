import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { ActionSettings } from './ActionSettings'

const meta: Meta<typeof ActionSettings> = {
  title: 'Features/Actions/ActionSettings',
  component: ActionSettings,
  args: {
    openSettings: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ActionSettings>

export const Default: Story = {}
export const Mobile: Story = getMobileStory(Default)
export const Tablet: Story = getTabletStory(Default)
