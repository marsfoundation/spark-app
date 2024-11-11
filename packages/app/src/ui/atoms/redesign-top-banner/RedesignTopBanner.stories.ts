import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { RedesignTopBanner } from './RedesignTopBanner'

const meta: Meta<typeof RedesignTopBanner> = {
  title: 'Components/Atoms/RedesignTopBanner',
  component: RedesignTopBanner,
  decorators: [WithClassname('w-full'), withRouter],
}

export default meta
type Story = StoryObj<typeof RedesignTopBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
