import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { TransactionOverview } from './TransactionOverview'

const meta: Meta<typeof TransactionOverview> = {
  title: 'Features/FarmDetails/Dialogs/Claim/Components/TransactionOverview',
  component: TransactionOverview,
  decorators: [WithClassname('max-w-xl')],
  args: {
    txOverview: {
      reward: {
        token: tokens.SKY,
        value: NormalizedUnitNumber(500.89),
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TransactionOverview>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const DesktopZeroApy: Story = {
  args: {
    txOverview: {
      reward: {
        token: tokens.SKY.clone({ unitPriceUsd: NormalizedUnitNumber(0) }),
        value: NormalizedUnitNumber(500.89),
      },
    },
  },
}
