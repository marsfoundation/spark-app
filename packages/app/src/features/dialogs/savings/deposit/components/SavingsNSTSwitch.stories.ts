import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SavingsNSTSwitch } from './SavingsNSTSwitch'

const meta: Meta<typeof SavingsNSTSwitch> = {
  title: 'Features/Dialogs/Savings/Components/SavingsNSTSwitch',
  component: SavingsNSTSwitch,
  decorators: [WithClassname('max-w-xl')],
  args: {
    checked: true,
    onClick: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsNSTSwitch>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)
