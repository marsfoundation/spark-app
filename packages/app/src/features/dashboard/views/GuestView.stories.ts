import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { chromatic } from '@storybook/viewports'

import { GuestView } from './GuestView'

const meta: Meta<typeof GuestView> = {
  title: 'Features/Dashboard/Views/GuestView',
  component: GuestView,
  decorators: [WithTooltipProvider()],
  args: {
    openConnectModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof GuestView>

export const Desktop: Story = {}
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: { viewports: [chromatic.mobile] },
  },
}
