import { WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { withRouter } from 'storybook-addon-remix-react-router'
import { TopbarSparkRewards } from './TopbarSparkRewards'

const meta: Meta<typeof TopbarSparkRewards> = {
  title: 'Features/Topbar/Components/TopbarSparkRewards',
  decorators: [WithTooltipProvider(), withRouter],
  component: TopbarSparkRewards,
  args: {
    totalUsdAmount: NormalizedUnitNumber(250),
  },
}

export default meta
type Story = StoryObj<typeof TopbarSparkRewards>

export const Default: Story = {}
