import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SavingsUsdsSwitch } from './SavingsUsdsSwitch'

const meta: Meta<typeof SavingsUsdsSwitch> = {
  title: 'Features/Dialogs/Savings/Components/SavingsUsdsSwitch',
  component: SavingsUsdsSwitch,
  decorators: [WithClassname('max-w-xl')],
  args: {
    checked: true,
    onSwitch: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsUsdsSwitch>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
