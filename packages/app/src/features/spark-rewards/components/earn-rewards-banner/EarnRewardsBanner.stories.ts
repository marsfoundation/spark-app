import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { EarnRewardsBanner } from './EarnRewardsBanner'

const meta: Meta<typeof EarnRewardsBanner> = {
  title: 'Features/SparkRewards/Components/EarnRewardsBanner',
  decorators: [WithClassname('max-w-md'), withRouter()],
  component: EarnRewardsBanner,
}

export default meta
type Story = StoryObj<typeof EarnRewardsBanner>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
