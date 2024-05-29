import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NotFound } from './NotFound'

const meta: Meta<typeof NotFound> = {
  title: 'Features/Errors/NotFound',
  decorators: [withRouter()],
  component: NotFound,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Mobile: Story = getMobileStory(Default)
export const Tablet: Story = getTabletStory(Default)
