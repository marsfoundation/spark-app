import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SavingsUSDSSwitch } from './SavingsUSDSSwitch'

const meta: Meta<typeof SavingsUSDSSwitch> = {
  title: 'Features/Dialogs/Savings/Components/SavingsUSDSSwitch',
  component: SavingsUSDSSwitch,
  decorators: [WithClassname('max-w-xl')],
  args: {
    checked: true,
    onSwitch: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsUSDSSwitch>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
