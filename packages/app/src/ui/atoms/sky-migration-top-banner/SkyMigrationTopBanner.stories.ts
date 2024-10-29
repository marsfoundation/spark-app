import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { SkyMigrationTopBanner } from './SkyMigrationTopBanner'

const meta: Meta<typeof SkyMigrationTopBanner> = {
  title: 'Components/Atoms/SkyMigrationTopBanner',
  component: SkyMigrationTopBanner,
  decorators: [WithClassname('w-full'), withRouter],
}

export default meta
type Story = StoryObj<typeof SkyMigrationTopBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
