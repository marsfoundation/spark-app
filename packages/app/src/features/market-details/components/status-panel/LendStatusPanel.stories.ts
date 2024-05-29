import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { LendStatusPanel } from './LendStatusPanel'

const meta: Meta<typeof LendStatusPanel> = {
  title: 'Features/MarketDetails/Components/StatusPanel/LendStatusPanel',
  component: LendStatusPanel,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
}

export default meta
type Story = StoryObj<typeof LendStatusPanel>

export const CanBeLent: Story = {
  name: 'Can be lent',
  args: {
    status: 'yes',
    token: tokens['DAI'],
    totalLent: NormalizedUnitNumber(72_000),
    apy: Percentage(0.05),
  },
}

export const CanBeLentMobile = {
  ...getMobileStory(CanBeLent),
  name: 'Can be lent (Mobile)',
}
export const CanBeLentTablet = {
  ...getTabletStory(CanBeLent),
  name: 'Can be lent (Tablet)',
}
