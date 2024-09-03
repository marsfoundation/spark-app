import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { within } from '@testing-library/react'
import { SavingsUsdsSwitch } from './SavingsUsdsSwitch'

const meta: Meta<typeof SavingsUsdsSwitch> = {
  title: 'Features/Dialogs/Savings/Components/SavingsUsdsSwitch',
  component: SavingsUsdsSwitch,
  decorators: [WithClassname('max-w-xl')],
  args: {
    checked: true,
    onSwitch: () => {},
    apyImprovement: Percentage(0.01),
  },
}

export default meta
type Story = StoryObj<typeof SavingsUsdsSwitch>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithOpenedBenefits: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    ;(await canvas.findByRole('button')).click()
  },
}

export const WithoutImprovedApy: Story = {
  args: {
    apyImprovement: undefined,
  },
}
