import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { GuestModePanel } from './GuestModePanel'

const meta: Meta<typeof GuestModePanel> = {
  title: 'Features/Rewards/Components/GuestModePanel',
  decorators: [WithClassname('max-w-md'), withRouter()],
  component: GuestModePanel,
}

export default meta
type Story = StoryObj<typeof GuestModePanel>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
