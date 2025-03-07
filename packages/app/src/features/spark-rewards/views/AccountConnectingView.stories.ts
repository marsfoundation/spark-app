import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { AccountConnectingView } from './AccountConnectingView'

const meta: Meta<typeof AccountConnectingView> = {
  title: 'Features/SparkRewards/Views/AccountConnectingView',
  component: AccountConnectingView,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AccountConnectingView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
