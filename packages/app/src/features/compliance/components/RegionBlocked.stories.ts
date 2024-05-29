import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { RegionBlocked } from './RegionBlocked'

const meta: Meta<typeof RegionBlocked> = {
  title: 'Features/Compliance/Components/RegionBlocked',
  decorators: [withRouter()],
  component: RegionBlocked,
  args: {
    countryCode: 'IR',
  },
}

export default meta
type Story = StoryObj<typeof RegionBlocked>

export const Desktop: Story = {}
