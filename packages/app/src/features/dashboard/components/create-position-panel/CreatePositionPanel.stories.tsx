import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { CreatePositionPanel } from './CreatePositionPanel'

const meta: Meta<typeof CreatePositionPanel> = {
  title: 'Features/Dashboard/Components/CreatePositionPanel',
  component: CreatePositionPanel,
  decorators: [withRouter],
}

export default meta
type Story = StoryObj<typeof CreatePositionPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
