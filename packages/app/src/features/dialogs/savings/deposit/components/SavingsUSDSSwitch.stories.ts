import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { expect, waitFor, within } from '@storybook/test'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SavingsUsdsSwitch } from './SavingsUsdsSwitch'

const meta: Meta<typeof SavingsUsdsSwitch> = {
  title: 'Features/Dialogs/Savings/Components/SavingsUsdsSwitch',
  component: SavingsUsdsSwitch,
  decorators: [WithClassname('h-[1024px]')],
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
    const canvas = within(canvasElement.ownerDocument.body)
    ;(await canvas.findByRole('button')).click()
    const heading = await canvas.findByRole('heading', { name: 'Deposit into Savings USDS' })
    await waitFor(async () => {
      await expect(heading).toBeVisible()
    })
  },
}

export const WithoutImprovedApy: Story = {
  args: {
    apyImprovement: undefined,
  },
}
