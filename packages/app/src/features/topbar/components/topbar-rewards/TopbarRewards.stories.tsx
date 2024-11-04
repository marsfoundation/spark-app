import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { tokens } from '@sb/tokens'
import { userEvent, within } from '@storybook/test'
import { TopbarRewards } from './TopbarRewards'

const meta: Meta<typeof TopbarRewards> = {
  title: 'Features/Topbar/Components/TopbarRewards',
  decorators: [WithTooltipProvider(), WithClassname('flex')],
  component: TopbarRewards,
  args: {
    rewards: [
      {
        token: tokens.wstETH,
        amount: NormalizedUnitNumber(0.00157),
      },
      {
        token: tokens.WBTC,
        amount: NormalizedUnitNumber(0.0003498),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')

    await userEvent.click(button)
  },
}

export default meta
type Story = StoryObj<typeof TopbarRewards>

export const Default: Story = {}
