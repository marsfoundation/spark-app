import { WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { Percentage } from '@/domain/types/NumericValues'
import { withRouter } from 'storybook-addon-remix-react-router'
import { UpgradeSavingsBanner } from './UpgradeSavingsBanner'

const meta: Meta<typeof UpgradeSavingsBanner> = {
  title: 'Features/SavingsWithUsds/Components/UpgradeSavingsBanner',
  component: UpgradeSavingsBanner,
  decorators: [WithTooltipProvider(), withRouter()],
  args: {
    onUpgradeSavingsClick: () => {},
    apyImprovement: Percentage(0.01),
  },
}

export default meta
type Story = StoryObj<typeof UpgradeSavingsBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
