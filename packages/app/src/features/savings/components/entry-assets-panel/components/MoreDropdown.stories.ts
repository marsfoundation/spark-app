import { WithClassname } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { withRouter } from 'storybook-addon-remix-react-router'
import { MoreDropdown } from './MoreDropdown'

const meta: Meta<typeof MoreDropdown> = {
  title: 'Features/Savings/Components/EntryAssetsPanel/MoreDropdown',
  decorators: [WithClassname('p-8 bg-primary flex justify-end h-48'), withRouter()],
  component: MoreDropdown,
  args: { blockExplorerLink: '/' },
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')
    await userEvent.click(button)
  },
}

export default meta
type Story = StoryObj<typeof MoreDropdown>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: () => {},
}
