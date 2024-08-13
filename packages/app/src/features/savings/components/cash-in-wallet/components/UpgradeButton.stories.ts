import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { UpgradeButton } from './UpgradeButton'

const meta: Meta<typeof UpgradeButton> = {
  title: 'Features/Savings/Components/CashInWallet/UpgradeButton',
  decorators: [WithClassname('p-8 bg-white')],
  component: UpgradeButton,
  args: {
    token: tokens.DAI,
  },
}

export default meta
type Story = StoryObj<typeof UpgradeButton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
