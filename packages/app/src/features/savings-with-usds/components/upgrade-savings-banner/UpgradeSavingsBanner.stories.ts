import { WithTooltipProvider } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { withRouter } from 'storybook-addon-remix-react-router'
import { UpgradeSavingsBanner } from './UpgradeSavingsBanner'
import { Percentage } from '@/domain/types/NumericValues'

const meta: Meta<typeof UpgradeSavingsBanner> = {
  title: 'Features/SavingsWithUsds/Components/UpgradeSavingsBanner',
  component: UpgradeSavingsBanner,
  decorators: [WithTooltipProvider(), withRouter()],
  args: {
    onUpgradeSavingsClick: () => {},
    dsr: Percentage(0.05),
    ssr: Percentage(0.06),
  },
}

export default meta
type Story = StoryObj<typeof UpgradeSavingsBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)
