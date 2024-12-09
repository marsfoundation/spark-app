import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

import { DebtCeilingProgress } from './DebtCeilingProgress'

const meta: Meta<typeof DebtCeilingProgress> = {
  title: 'Features/MarketDetails/Components/MyWallet/DebtCeilingProgress',
  component: DebtCeilingProgress,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
}

export default meta
type Story = StoryObj<typeof DebtCeilingProgress>

export const Default: Story = {
  args: {
    debt: NormalizedUnitNumber(37_896_154),
    debtCeiling: NormalizedUnitNumber(50_000_000),
  },
}

export const Full: Story = {
  args: {
    debt: NormalizedUnitNumber(50_000_000),
    debtCeiling: NormalizedUnitNumber(50_000_000),
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
