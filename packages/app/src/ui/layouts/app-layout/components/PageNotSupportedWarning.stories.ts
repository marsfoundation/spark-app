import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { PageNotSupportedWarning } from './PageNotSupportedWarning'

const meta: Meta<typeof PageNotSupportedWarning> = {
  title: 'Components/Layouts/AppLayout/Components/PageNotSupportedWarning',
  component: PageNotSupportedWarning,
  args: {
    pageName: 'Easy Borrow',
  },
}

export default meta
type Story = StoryObj<typeof PageNotSupportedWarning>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
