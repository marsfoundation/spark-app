import { Meta, StoryObj } from '@storybook/react'

import { withRouter } from 'storybook-addon-remix-react-router'
import { CookieBanner } from './CookieBanner'

const meta: Meta<typeof CookieBanner> = {
  title: 'Features/Analytics/Components/CookieBanner',
  component: CookieBanner,
  decorators: [withRouter],
  args: {
    onAccept: () => {},
    onDecline: () => {},
  },
}

export default meta
type Story = StoryObj<typeof CookieBanner>

export const Desktop: Story = {}
