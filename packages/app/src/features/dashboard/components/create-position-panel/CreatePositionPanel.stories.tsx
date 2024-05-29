import { Meta, StoryObj } from '@storybook/react'
import { chromatic } from '@storybook/viewports'
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
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: { viewports: [chromatic.mobile] },
  },
}
