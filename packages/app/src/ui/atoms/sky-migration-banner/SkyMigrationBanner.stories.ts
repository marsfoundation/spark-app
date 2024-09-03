import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { SkyMigrationBanner } from './SkyMigrationBanner'

const meta: Meta<typeof SkyMigrationBanner> = {
  title: 'Components/Atoms/SkyMigrationBanner',
  component: SkyMigrationBanner,
  decorators: [WithClassname('w-full'), withRouter],
}

export default meta
type Story = StoryObj<typeof SkyMigrationBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
