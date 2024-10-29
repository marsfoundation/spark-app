import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { CreatePositionPanel } from './CreatePositionPanel'

const meta: Meta<typeof CreatePositionPanel> = {
  title: 'Features/MyPortfolio/Components/CreatePositionPanel',
  component: CreatePositionPanel,
  decorators: [withRouter],
}

export default meta
type Story = StoryObj<typeof CreatePositionPanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
