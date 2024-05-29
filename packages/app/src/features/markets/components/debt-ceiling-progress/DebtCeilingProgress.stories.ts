import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { DebtCeilingProgress } from './DebtCeilingProgress'

const meta: Meta<typeof DebtCeilingProgress> = {
  title: 'Features/Markets/Components/DebtCeilingProgress',
  component: DebtCeilingProgress,
  decorators: [WithTooltipProvider(), WithClassname('max-w-2xl'), withRouter],
}

export default meta
type Story = StoryObj<typeof DebtCeilingProgress>

export const Default: Story = {
  args: {
    token: tokens['GNO'],
    debt: NormalizedUnitNumber(123),
    debtCeiling: NormalizedUnitNumber(200),
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)
