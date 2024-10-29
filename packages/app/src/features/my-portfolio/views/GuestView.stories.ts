import { WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { GuestView } from './GuestView'

const meta: Meta<typeof GuestView> = {
  title: 'Features/MyPortfolio/Views/GuestView',
  component: GuestView,
  decorators: [WithTooltipProvider()],
  args: {
    openConnectModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof GuestView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
